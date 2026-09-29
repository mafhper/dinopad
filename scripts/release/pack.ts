// Empacota o build estático do Dinopad para o artefato da release.
//
// A release-core publica o ZIP depois de rodar o `build.command` que o
// `.github/release.config.json` declara; ela não sabe o que é um site, e não
// precisa saber. Este script é a parte que sabe: pega `dist/`, escreve um
// MANIFEST que diz de qual versão e de qual commit o ZIP saiu, e grava o
// arquivo num caminho estável — o nome versionado é aplicado pelo
// `artifact.release_name` do config, não aqui.
//
// Duas propriedades que valem mais do que o código sugere:
//
//   1. A data do MANIFEST vem do COMMIT, não do relógio. Um `npm run release:pack`
//      rodado três vezes no mesmo commit produz o mesmo manifesto, e o que muda
//      no ZIP é o conteúdo, não o carimbo de tempo.
//   2. O ZIP é escrito com `zlib` puro, sem dependência. `npm audit` deste
//      projeto é zero e um empacotador de release não é o lugar certo para
//      introduzir a primeira.
//
// Uso: npm run release:pack   (depois de npm run build)

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { crc32, deflateRawSync, inflateRawSync } from 'node:zlib';

const root = resolve(import.meta.dirname, '..', '..');
const dist = resolve(root, 'dist');
const saida = resolve(root, 'release', 'dinopad.zip');

function cmd(exe: string, args: string[]): string {
  return execFileSync(exe, args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

// O `base` do Vite mora no vite.config.ts, e é a constraint que mais surpreende
// quem baixa o ZIP: extrair e abrir `index.html` do disco não funciona, porque
// todo asset está referenciado a partir de `/dinopad/`. Ele vai para o MANIFEST
// e para a seção de uso da release — porque a omissão seria o tipo de defeito
// que só aparece depois de a pessoa tentar.
const baseDoVite = /base:\s*'([^']+)'/.exec(readFileSync(resolve(root, 'vite.config.ts'), 'utf8'))?.[1] ?? '/';

function listar(arquivo: string): string[] {
  return readdirSync(arquivo).flatMap((nome) => {
    const completo = resolve(arquivo, nome);
    return statSync(completo).isDirectory() ? listar(completo) : [completo];
  });
}

const posix = (caminho: string) => relative(dist, caminho).split(sep).join('/');

/**
 * Ordem por ponto de código, e não por collation.
 *
 * A ordem das entradas vai para o arquivo ZIP e para o relatório. `localeCompare`
 * sem locale explícito depende do ICU do runtime — que muda entre versão de Node e
 * entre plataforma — e o efeito é um artefato cujo conteúdo muda sem que o
 * conteúdo do projeto mude. Caminhos POSIX são ASCII, então comparar por ponto de
 * código dá a mesma ordem em qualquer máquina, sem ICU.
 */
const porCodigo = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

// ── O ZIP ───────────────────────────────────────────────────────────────────
// Escrito à mão porque nenhum pacote faz isto melhor do que `node:zlib`. Só o
// formato que o `unzip` de qualquer plataforma precisa ler: cabeçalhos local e
// central, um registro por entrada, e o fim do diretório central.

const ASSINATURA_LOCAL = 0x04034b50;
const ASSINATURA_CENTRAL = 0x02014b50;
const ASSINATURA_FIM = 0x06054b50;
const METODO_ARMAZENAR = 0;
const METODO_DEFLATE = 8;

interface Entrada {
  nome: string;
  bruto: Buffer;
  /** Os bytes que vão para o arquivo, e não o original: deflate ou o próprio bruto. */
  payload: Buffer;
  /** O método DEVE descrever `payload`. A v1 escrevia sempre DEFLATE — e o `unzip -t` da
   *  CI reprovou a release v0.1.0 inteira por isso. Ver `conferirZip`. */
  metodo: number;
  crc: number;
}

interface RelogioDos {
  data: number;
  hora: number;
}

function paraDos(iso: string): RelogioDos {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new Error(`Data de commit ilegível: "${iso}".`);
  return {
    hora: (d.getUTCHours() << 11) | (d.getUTCMinutes() << 5) | (d.getUTCSeconds() >> 1),
    data: ((d.getUTCFullYear() - 1980) << 9) | ((d.getUTCMonth() + 1) << 5) | d.getUTCDate(),
  };
}

function escreverZip(entradas: Entrada[], relogio: RelogioDos): Buffer {
  const locais: Buffer[] = [];
  const central: Buffer[] = [];
  let deslocamento = 0;

  for (const entrada of entradas) {
    const nome = Buffer.from(entrada.nome, 'utf8');
    // O bit 11 declara o nome como UTF-8. Os nomes daqui são ASCII, mas um
    // arquivo de conteúdo com acento no nome quebraria em leitores ingênuos.
    const sinalizadores = 0x0800;

    const cabecalho = Buffer.alloc(30);
    cabecalho.writeUInt32LE(ASSINATURA_LOCAL, 0);
    cabecalho.writeUInt16LE(20, 4); // versão necessária
    cabecalho.writeUInt16LE(sinalizadores, 6);
    cabecalho.writeUInt16LE(entrada.metodo, 8);
    cabecalho.writeUInt16LE(relogio.hora, 10);
    cabecalho.writeUInt16LE(relogio.data, 12);
    cabecalho.writeUInt32LE(entrada.crc, 14);
    cabecalho.writeUInt32LE(entrada.payload.length, 18);
    cabecalho.writeUInt32LE(entrada.bruto.length, 22);
    cabecalho.writeUInt16LE(nome.length, 26);
    cabecalho.writeUInt16LE(0, 28); // sem campo extra

    const registro = Buffer.alloc(46);
    registro.writeUInt32LE(ASSINATURA_CENTRAL, 0);
    registro.writeUInt16LE(20, 4); // versão de criação
    registro.writeUInt16LE(20, 6); // versão necessária
    registro.writeUInt16LE(sinalizadores, 8);
    registro.writeUInt16LE(entrada.metodo, 10);
    registro.writeUInt16LE(relogio.hora, 12);
    registro.writeUInt16LE(relogio.data, 14);
    registro.writeUInt32LE(entrada.crc, 16);
    registro.writeUInt32LE(entrada.payload.length, 20);
    registro.writeUInt32LE(entrada.bruto.length, 24);
    registro.writeUInt16LE(nome.length, 28);
    registro.writeUInt16LE(0, 30); // extra
    registro.writeUInt16LE(0, 32); // comentário
    registro.writeUInt16LE(0, 34); // disco inicial
    registro.writeUInt16LE(0, 36); // atributos internos
    registro.writeUInt32LE(0, 38); // atributos externos
    registro.writeUInt32LE(deslocamento, 42);

    locais.push(cabecalho, nome, entrada.payload);
    central.push(registro, nome);
    deslocamento += cabecalho.length + nome.length + entrada.payload.length;
  }

  const diretorio = Buffer.concat(central);
  const fim = Buffer.alloc(22);
  fim.writeUInt32LE(ASSINATURA_FIM, 0);
  fim.writeUInt16LE(0, 4); // disco deste
  fim.writeUInt16LE(0, 6); // disco do diretório
  fim.writeUInt16LE(entradas.length, 8);
  fim.writeUInt16LE(entradas.length, 10);
  fim.writeUInt32LE(diretorio.length, 12);
  fim.writeUInt32LE(deslocamento, 16);
  fim.writeUInt16LE(0, 20); // sem comentário

  return Buffer.concat([...locais, diretorio, fim]);
}

// O ZIP é relido antes de sair daqui, e cada entrada é **descomprimida**.
//
// Esta função não existia na v1, e a ausência é a origem do incidente: a
// verificação local abria o arquivo com uma reader independente, lia o
// diretório central, os nomes e o `MANIFEST.json` — e passava. Ela não
// descomprimia nada. O `unzip -t` do gate descomprime, e reprovou a release
// v0.1.0 inteira.
//
// A lição é a mesma que a do `welcome.check.mjs` da frota: *ler a estrutura não
// é ler o conteúdo*. Por isso a conferência percorre o **diretório central do
// arquivo gravado** — não o array que o gerou — e compara byte a byte.
function conferirZip(zip: Buffer, originais: Entrada[]): { guardadas: number; defladas: number } {
  const assinatura = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
  const fim = zip.lastIndexOf(assinatura, zip.length - 22);
  if (fim < 0) throw new Error('O ZIP gerado não tem registro de fim de diretório central.');
  const total = zip.readUInt16LE(fim + 10);
  if (total !== originais.length) {
    throw new Error(`O diretório central declara ${total} entradas; esperava ${originais.length}.`);
  }
  const diretorio = zip.readUInt32LE(fim + 16);
  if (diretorio + zip.readUInt32LE(fim + 12) !== fim) {
    throw new Error('O deslocamento do diretório central não fecha com o fim do arquivo.');
  }

  let cursor = diretorio;
  let guardadas = 0;
  let defladas = 0;

  for (const original of originais) {
    if (zip.readUInt32LE(cursor) !== ASSINATURA_CENTRAL) {
      throw new Error(`Registro central inválido na entrada "${original.nome}".`);
    }
    const metodo = zip.readUInt16LE(cursor + 10);
    const crc = zip.readUInt32LE(cursor + 16);
    const comprimido = zip.readUInt32LE(cursor + 20);
    const tamanhoNome = zip.readUInt16LE(cursor + 28);
    const extra = zip.readUInt16LE(cursor + 30);
    const comentario = zip.readUInt16LE(cursor + 32);
    const local = zip.readUInt32LE(cursor + 42);
    const nome = zip.toString('utf8', cursor + 46, cursor + 46 + tamanhoNome);
    if (nome !== original.nome) {
      throw new Error(`O diretório central lista "${nome}" onde esperava "${original.nome}".`);
    }

    // O cabeçalho local tem os próprios campos de nome e extra, e eles podem
    // diferir dos do central — daí a segunda leitura em vez de reusar o tamanho.
    const inicio = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
    const payload = zip.subarray(inicio, inicio + comprimido);
    const reconstituido = metodo === METODO_DEFLATE ? inflateRawSync(payload) : payload;

    if (metodo === METODO_DEFLATE) defladas += 1;
    else if (metodo === METODO_ARMAZENAR) guardadas += 1;
    else throw new Error(`Método de compressão desconhecido (${metodo}) em "${original.nome}".`);

    if (reconstituido.length !== original.bruto.length || !reconstituido.equals(original.bruto)) {
      throw new Error(`A entrada "${original.nome}" não volta igual depois de descompactar (${reconstituido.length} bytes contra ${original.bruto.length}).`);
    }
    if (crc !== original.crc || crc32(reconstituido) !== original.crc) {
      throw new Error(`O CRC32 de "${original.nome}" não confere.`);
    }

    cursor += 46 + tamanhoNome + extra + comentario;
  }

  return { guardadas, defladas };
}

// ── O MANIFEST ──────────────────────────────────────────────────────────────

function montar(): {
  zip: Buffer;
  tag: string;
  versao: string;
  arquivos: number;
  bytes: number;
  guardadas: number;
  defladas: number;
} {
  if (!existsSync(dist)) {
    throw new Error('dist/ não existe. Rode `npm run build` antes de empacotar.');
  }
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')) as { name?: string; version: string };
  const versao = String(pkg.version);
  // O release-core já valida a tag contra o manifesto antes de compilar; aqui a
  // mesma checagem acontece em segundos, no lugar onde dá para corrigir.
  const tag = process.env.TAG?.trim() || `v${versao}`;
  if (tag.replace(/^v/, '').split(/[-+]/)[0] !== versao) {
    throw new Error(`A tag ${tag} não corresponde à versão ${versao} do package.json.`);
  }

  const arquivos = listar(dist).sort((a, b) => porCodigo(posix(a), posix(b)));
  if (arquivos.length === 0) throw new Error('dist/ está vazio: não há nada para empacotar.');

  const relogio = paraDos(cmd('git', ['log', '-1', '--format=%cI']));
  const total = arquivos.reduce((soma, caminho) => soma + statSync(caminho).size, 0);

  const manifesto = {
    projeto: pkg.name ?? 'dinopad',
    versao,
    tag,
    commit: cmd('git', ['rev-parse', 'HEAD']),
    data: cmd('git', ['log', '-1', '--format=%cI']),
    base: baseDoVite,
    arquivos: arquivos.length,
    bytes: total,
  };

  // A ordem é alfabética e não a de leitura: o ZIP fica idêntico para o mesmo
  // conteúdo, independentemente da ordem em que o sistema de arquivos devolveu
  // os nomes.
  const conteudos: Array<[string, Buffer]> = arquivos.map(
    (caminho): [string, Buffer] => [posix(caminho), readFileSync(caminho)],
  );
  conteudos.push(['MANIFEST.json', Buffer.from(`${JSON.stringify(manifesto, null, 2)}\n`, 'utf8')]);
  conteudos.sort(([a], [b]) => porCodigo(a, b));

  // O método é decidido **por entrada**, e é ele que vai no cabeçalho. A v1
  // gravava sempre DEFLATE, e gravava os bytes crus quando o deflate não
  // ajudava — que é o que acontece com WebP e AVIF, que já vêm comprimidos.
  // O resultado era um arquivo que abria, listava e só falhava na hora de
  // descompactar. Foi o que reprovou o `unzip -t` do gate na v0.1.0.
  const entradas: Entrada[] = conteudos.map(([nome, bruto]) => {
    const comprimido = deflateRawSync(bruto, { level: 9 });
    const compensa = comprimido.length < bruto.length;
    return {
      nome,
      bruto,
      payload: compensa ? comprimido : bruto,
      metodo: compensa ? METODO_DEFLATE : METODO_ARMAZENAR,
      crc: crc32(bruto),
    };
  });

  const zip = escreverZip(entradas, relogio);
  const conferencia = conferirZip(zip, entradas);

  return { zip, tag, versao, arquivos: arquivos.length, bytes: total, ...conferencia };
}

const resultado = montar();
mkdirSync(resolve(root, 'release'), { recursive: true });
writeFileSync(saida, resultado.zip);

console.log(
  `Empacotado ${resultado.versao} (${resultado.tag}): ${resultado.arquivos} arquivos, ` +
    `${(resultado.bytes / 1024 / 1024).toFixed(1)} MB, ${(resultado.zip.length / 1024 / 1024).toFixed(1)} MB no ZIP.`,
);
console.log(
  `Conferido: ${resultado.defladas} entradas deflate, ${resultado.guardadas} guardadas — ` +
    `todas descompactadas de volta e comparadas com o original.`,
);
console.log(`Artefato: ${relative(root, saida)}`);
console.log(`Base do Vite: ${baseDoVite} — extrair o ZIP não basta para abrir em file://; sirva sob esse caminho.`);
