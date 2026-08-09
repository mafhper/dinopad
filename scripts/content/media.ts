import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import type { MediaAsset, OrganismoAtlas } from '../../src/content/schema';
import { loadCatalog, repoRoot } from './io';
import { textOnly } from './text-only';

type CommonsMetadata = { value?: string };
type CommonsImageInfo = {
  thumburl?: string;
  url?: string;
  descriptionurl?: string;
  extmetadata?: Record<string, CommonsMetadata>;
};
type CommonsPage = { pageid: number; title: string; imageinfo?: CommonsImageInfo[] };
type CommonsResponse = { query?: { pages?: CommonsPage[] } };
type ApprovedLicense = MediaAsset['licenca'];
type ManualMedia = {
  downloadUrl: string;
  sourceUrl: string;
  author: string;
  fonte: string;
  licenca: ApprovedLicense;
  titulo: string;
  alt: string;
  legenda: string;
  representacao: MediaAsset['representacao'];
};

const accessedAt = new Date().toISOString().slice(0, 10);
const catalogo = loadCatalog();
const outputRoot = resolve(repoRoot, 'public/media/organismos');
const metadataPath = resolve(repoRoot, 'src/content/data/media.json');
const sourceHome = 'https://mafhper.github.io/dinopad/';
const requestDelayMs = 550;
const allowedLicenseUrls: Record<ApprovedLicense, string> = {
  CC0: 'https://creativecommons.org/publicdomain/zero/1.0/',
  PDM: 'https://creativecommons.org/publicdomain/mark/1.0/',
  'CC-BY-2.0': 'https://creativecommons.org/licenses/by/2.0/',
  'CC-BY-3.0': 'https://creativecommons.org/licenses/by/3.0/',
  'CC-BY-4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC-BY-SA-2.0': 'https://creativecommons.org/licenses/by-sa/2.0/',
  'CC-BY-SA-3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC-BY-SA-4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
  MIT: 'https://opensource.org/license/mit',
};
const manualMedia: Partial<Record<string, Record<'evidencia' | 'interpretacao', ManualMedia>>> = {
  austroposeidon: {
    evidencia: {
      downloadUrl: 'https://journals.plos.org/plosone/article/figure/image?download&size=large&id=10.1371/journal.pone.0163373.g002',
      sourceUrl: 'https://doi.org/10.1371/journal.pone.0163373.g002',
      author: 'Bandeira et al. (2016)',
      fonte: 'PLOS ONE',
      licenca: 'CC-BY-4.0',
      titulo: 'Vértebra cervical de Austroposeidon',
      alt: 'Vértebra cervical fóssil do holótipo de Austroposeidon magnificus em vistas lateral e anterior.',
      legenda: 'Vértebra cervical do holótipo, fotografada e descrita no artigo científico que nomeou a espécie.',
      representacao: 'evidencia',
    },
    interpretacao: {
      downloadUrl: 'https://journals.plos.org/plosone/article/figure/image?download&size=large&id=10.1371/journal.pone.0163373.g013',
      sourceUrl: 'https://doi.org/10.1371/journal.pone.0163373.g013',
      author: 'Bandeira et al. (2016)',
      fonte: 'PLOS ONE',
      licenca: 'CC-BY-4.0',
      titulo: 'Reconstrução anatômica das cavidades vertebrais',
      alt: 'Reconstrução científica das conexões pneumáticas internas em vértebras de Austroposeidon magnificus.',
      legenda: 'Reconstrução anatômica por tomografia. Substitui paleoarte e mostra uma interpretação diretamente testável do interior dos ossos.',
      representacao: 'interpretacao',
    },
  },
};
const curatedCommonsTitles: Partial<Record<string, Partial<Record<'evidencia' | 'interpretacao', string>>>> = {
  irritator: {
    evidencia: 'File:Holotype of Irritator challengeri teeth.png',
  },
  'smilodon-populator': {
    evidencia: 'File:Smilodon populator fossil, Tellus Science Museum 1.jpg',
    interpretacao: 'File:Smilodon populator rec.jpg',
  },
  dicroidium: {
    evidencia: 'File:Dicroidium zuberi leaf.jpg',
    interpretacao: 'File:Dicroidium 4.jpg',
  },
  'australopithecus-garhi': {
    evidencia: 'File:Musée national d\'Ethiopie-Australopithecus garhi (1).jpg',
    interpretacao: 'File:Musée national d\'Ethiopie-Australopithecus garhi (2).jpg',
  },
  'ardipithecus-ramidus': {
    evidencia: 'File:Ardi.jpg',
    interpretacao: 'File:Ardipithecus ramidus.jpg',
  },
  'homo-rudolfensis': {
    evidencia: 'File:At Nairobi National Museum 2025 094.jpg',
    interpretacao: 'File:Homo rudolfensis with skull.jpg',
  },
  'homo-floresiensis': {
    evidencia: 'File:LB1 skull.jpg',
  },
  'tiktaalik-roseae': {
    evidencia: 'File:Tiktaalik roseae.jpg',
    interpretacao: 'File:Tiktaalik roseae.png',
  },
  'calamites-suckowii': {
    evidencia: 'File:Calamites stems.JPG',
    interpretacao: 'File:AmCyc Coal Plants - Calamites.jpg',
  },
  'glossopteris': {
    evidencia: 'File:Glossopteris sp. (fossil plant).jpg',
    interpretacao: 'File:Glossopteris White estampa VII.jpg',
  },
  'cycadeoidea': {
    evidencia: 'File:Cycadeoidea fossil cropped.png',
    interpretacao: 'File:Cycadeoidea marylandica - National Museum of Natural History - IMG 1978.JPG',
  },
};

function licenseFrom(metadata: Record<string, CommonsMetadata>): ApprovedLicense | null {
  const raw = textOnly(metadata.LicenseShortName?.value ?? metadata.UsageTerms?.value ?? '').toUpperCase();
  if (raw.includes('GFDL')) return null;
  if (raw.includes('CC0')) return 'CC0';
  if (raw.includes('PUBLIC DOMAIN')) return 'PDM';
  if (raw.includes('CC BY-SA 4.0')) return 'CC-BY-SA-4.0';
  if (raw.includes('CC BY-SA 3.0')) return 'CC-BY-SA-3.0';
  if (raw.includes('CC BY-SA 2.0')) return 'CC-BY-SA-2.0';
  if (raw.includes('CC BY 4.0')) return 'CC-BY-4.0';
  if (raw.includes('CC BY 3.0')) return 'CC-BY-3.0';
  if (raw.includes('CC BY 2.0')) return 'CC-BY-2.0';
  return null;
}

function sleep(ms: number) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function fetchWithRetry(url: URL | string): Promise<Response> {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    await sleep(requestDelayMs);
    try {
      const response = await fetch(url, {
        headers: { 'user-agent': 'Dinopad media curator/0.1 (educational project; contact via GitHub)' },
        signal: AbortSignal.timeout(25_000),
      });
      if (response.status !== 429 && response.status < 500) return response;
      if (attempt === 5) return response;
      const retryAfter = Number(response.headers.get('retry-after'));
      const requestedWait = Number.isFinite(retryAfter) ? retryAfter * 1000 : attempt * 2500;
      await sleep(Math.min(requestedWait, 15_000));
    } catch (error) {
      if (attempt === 5) throw error;
      await sleep(attempt * 1500);
    }
  }
  throw new Error('Tentativas de rede esgotadas.');
}

async function commonsSearch(query: string): Promise<CommonsPage[]> {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  const params = {
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '20',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '1600',
    format: 'json',
    formatversion: '2',
    origin: '*',
  };
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`Commons respondeu ${response.status} para “${query}”`);
  const data = await response.json() as CommonsResponse;
  return data.query?.pages ?? [];
}

async function commonsFile(title: string): Promise<CommonsPage> {
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  const params = {
    action: 'query',
    titles: title,
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    iiurlwidth: '1600',
    format: 'json',
    formatversion: '2',
    origin: '*',
  };
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  const response = await fetchWithRetry(url);
  if (!response.ok) throw new Error(`Commons respondeu ${response.status} para “${title}”`);
  const data = await response.json() as CommonsResponse;
  const page = data.query?.pages?.[0];
  if (!page || !usablePage(page)) throw new Error(`Arquivo curado indisponível ou com licença rejeitada: ${title}`);
  return page;
}

function usablePage(page: CommonsPage): boolean {
  const info = page.imageinfo?.[0];
  const meta = info?.extmetadata;
  const url = info?.thumburl ?? info?.url;
  if (!info || !meta || !url || !licenseFrom(meta)) return false;
  const lower = `${page.title} ${textOnly(meta.ImageDescription?.value)}`.toLowerCase();
  return !['logo', 'icon', 'map', 'cladogram', 'stamp', 'coin', 'specifier', 'phylogeny'].some((term) => lower.includes(term));
}

function preferredThumbnail(info: CommonsImageInfo): string | undefined {
  if (info.thumburl?.includes('/thumb/')) return info.thumburl;
  const original = info.url;
  if (!original) return undefined;
  const match = original.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/([^/]+)\/([^/]+)\/([^/?#]+)$/i);
  if (!match) return info.thumburl ?? original;
  const [, base, firstHash, secondHash, fileName] = match;
  return `${base}/thumb/${firstHash}/${secondHash}/${fileName}/960px-${fileName}`;
}

async function findCommonsPage(
  organismo: OrganismoAtlas,
  papel: 'evidencia' | 'interpretacao',
  usedPageIds: Set<number>,
): Promise<{ page: CommonsPage; strictMatch: boolean }> {
  const curatedTitle = curatedCommonsTitles[organismo.id]?.[papel];
  if (curatedTitle) return { page: await commonsFile(curatedTitle), strictMatch: true };
  const name = organismo.nomeCientifico;
  const genus = name.split(' ')[0];
  const livingSpecies = organismo.intervalo.fimMa === 0;
  const queries = papel === 'evidencia' && livingSpecies
    ? [`"${name}"`, `intitle:${genus} ${name.split(' ')[1]}`, `"${name}" animal`]
    : papel === 'evidencia'
    ? [`intitle:${genus} fossil`, `intitle:${genus} skeleton`, `intitle:${genus} skull`, `"${name}" specimen`]
    : livingSpecies
      ? [`"${name}" skull`, `"${name}" skeleton`, `intitle:${genus} anatomy`, `"${name}"`]
    : organismo.reino === 'plantae'
      ? [`intitle:${genus} reconstruction`, `intitle:${genus} restoration`, `intitle:${genus} fossil`, `"${name}" plant`, `"${name}"`]
      : [`intitle:${genus} restoration`, `intitle:${genus} reconstruction`, `intitle:${genus} life`, `"${name}" paleoart`, `"${name}" fossil`, `"${name}"`];
  const roleWords = papel === 'evidencia' && livingSpecies
    ? [name.toLowerCase(), genus.toLowerCase(), 'wild', 'animal', 'female', 'male']
    : papel === 'evidencia'
    ? ['fossil', 'skeleton', 'skull', 'bone', 'holotype', 'museum', 'cast', 'specimen', 'esqueleto', 'fóssil', 'cranio', 'crânio']
    : ['restoration', 'reconstruction', 'life', 'paleoart', 'drawing', 'illustration', 'restauração', 'reconstrução'];
  let fallback: CommonsPage | undefined;

  for (const query of queries) {
    const pages = await commonsSearch(query);
    for (const page of pages) {
      if (usedPageIds.has(page.pageid) || !usablePage(page)) continue;
      const title = page.title.toLowerCase();
      if (!title.includes(genus.toLowerCase())) continue;
      const meta = page.imageinfo?.[0]?.extmetadata ?? {};
      const haystack = `${page.title} ${textOnly(meta.ImageDescription?.value)}`.toLowerCase();
      if (!haystack.includes(name.toLowerCase())) continue;
      fallback ??= page;
      if (roleWords.some((word) => haystack.includes(word))) return { page, strictMatch: true };
    }
  }
  if (fallback) return { page: fallback, strictMatch: false };
  throw new Error(`Nenhuma mídia com licença permitida encontrada para ${name} (${papel}).`);
}

function authorFrom(metadata: Record<string, CommonsMetadata>): string {
  return textOnly(metadata.Artist?.value) || textOnly(metadata.Credit?.value) || 'Autoria não identificada na página original';
}

async function downloadVariant(
  page: CommonsPage,
  organismo: OrganismoAtlas,
  papel: 'evidencia' | 'interpretacao',
  strictMatch: boolean,
): Promise<MediaAsset> {
  const info = page.imageinfo?.[0];
  const metadata = info?.extmetadata ?? {};
  const remoteUrl = info ? preferredThumbnail(info) : undefined;
  const licenca = licenseFrom(metadata);
  if (!remoteUrl || !info || !licenca) throw new Error(`Mídia incompleta: ${page.title}`);
  const response = await fetchWithRetry(remoteUrl);
  if (!response.ok) throw new Error(`Falha ${response.status} ao baixar ${remoteUrl}`);
  const input = Buffer.from(await response.arrayBuffer());
  const targetDir = resolve(outputRoot, organismo.id);
  mkdirSync(targetDir, { recursive: true });
  const image = sharp(input).rotate();

  await Promise.all([
    image.clone().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 80 }).toFile(resolve(targetDir, `${papel}-480.webp`)),
    image.clone().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 82 }).toFile(resolve(targetDir, `${papel}-960.webp`)),
    image.clone().resize({ width: 480, withoutEnlargement: true }).avif({ quality: 48 }).toFile(resolve(targetDir, `${papel}-480.avif`)),
    image.clone().resize({ width: 960, withoutEnlargement: true }).avif({ quality: 52 }).toFile(resolve(targetDir, `${papel}-960.avif`)),
  ]);

  const actualRole = papel === 'interpretacao' && !strictMatch ? 'evidencia' : papel;
  const isFallback = papel === 'interpretacao' && !strictMatch;
  const livingSpecies = organismo.intervalo.fimMa === 0;
  const pageTitle = page.title.replace(/^File:/, '').replace(/_/g, ' ');
  return {
    id: `${organismo.id}-${papel}`,
    entidade: { tipo: 'organismo', id: organismo.id },
    papel,
    representacao: actualRole,
    titulo: isFallback
      ? `Segunda evidência aberta de ${organismo.nomePt}`
      : `${papel === 'evidencia' ? (livingSpecies ? 'Registro fotográfico' : 'Evidência fóssil') : (livingSpecies ? 'Anatomia comparada' : 'Reconstrução')} de ${organismo.nomePt}`,
    autor: authorFrom(metadata),
    fonte: 'Wikimedia Commons',
    urlFonte: info.descriptionurl ?? `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
    licenca,
    urlLicenca: textOnly(metadata.LicenseUrl?.value) || allowedLicenseUrls[licenca],
    acessadoEm: accessedAt,
    arquivos: {
      src: `/media/organismos/${organismo.id}/${papel}-960.webp`,
      srcSet: `/media/organismos/${organismo.id}/${papel}-480.webp 480w, /media/organismos/${organismo.id}/${papel}-960.webp 960w`,
      avifSrcSet: `/media/organismos/${organismo.id}/${papel}-480.avif 480w, /media/organismos/${organismo.id}/${papel}-960.avif 960w`,
    },
    altPt: isFallback
      ? `${pageTitle}, segunda evidência científica aberta relacionada a ${organismo.nomeCientifico}.`
      : `${pageTitle}, ${papel === 'evidencia' ? (livingSpecies ? 'registro fotográfico' : 'registro fóssil') : (livingSpecies ? 'registro anatômico comparativo' : 'reconstrução interpretativa')} de ${organismo.nomeCientifico}.`,
    legendaPt: isFallback
      ? `Outra evidência aberta, usada porque não foi localizada paleoarte confiável com licença aceita. Não representa a aparência em vida.`
      : papel === 'evidencia'
        ? livingSpecies
          ? `Registro observável de ${organismo.nomeCientifico} em vida. Fotografias documentam indivíduos; não representam toda a variação da espécie.`
          : `Registro material preservado de ${organismo.nomeCientifico}. Observe o que o fóssil mostra antes de comparar com reconstruções.`
        : livingSpecies
          ? `Registro anatômico usado para comparar estruturas. A imagem não representa uma escala de progresso evolutivo.`
        : `Interpretação da aparência em vida baseada nas evidências disponíveis; cores e partes não fossilizadas podem mudar com novas descobertas.`,
    alteracoes: 'Redimensionamento, rotação conforme metadados e conversão local para WebP e AVIF; conteúdo visual não foi gerado por IA.',
  };
}

async function downloadManualVariant(
  item: ManualMedia,
  organismo: OrganismoAtlas,
  papel: 'evidencia' | 'interpretacao',
): Promise<MediaAsset> {
  const response = await fetchWithRetry(item.downloadUrl);
  if (!response.ok) throw new Error(`Falha ${response.status} ao baixar ${item.downloadUrl}`);
  const input = Buffer.from(await response.arrayBuffer());
  const targetDir = resolve(outputRoot, organismo.id);
  mkdirSync(targetDir, { recursive: true });
  const image = sharp(input).rotate();
  await Promise.all([
    image.clone().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 80 }).toFile(resolve(targetDir, `${papel}-480.webp`)),
    image.clone().resize({ width: 960, withoutEnlargement: true }).webp({ quality: 82 }).toFile(resolve(targetDir, `${papel}-960.webp`)),
    image.clone().resize({ width: 480, withoutEnlargement: true }).avif({ quality: 48 }).toFile(resolve(targetDir, `${papel}-480.avif`)),
    image.clone().resize({ width: 960, withoutEnlargement: true }).avif({ quality: 52 }).toFile(resolve(targetDir, `${papel}-960.avif`)),
  ]);
  return {
    id: `${organismo.id}-${papel}`,
    entidade: { tipo: 'organismo', id: organismo.id },
    papel,
    representacao: item.representacao,
    titulo: item.titulo,
    autor: item.author,
    fonte: item.fonte,
    urlFonte: item.sourceUrl,
    licenca: item.licenca,
    urlLicenca: allowedLicenseUrls[item.licenca],
    acessadoEm: accessedAt,
    arquivos: {
      src: `/media/organismos/${organismo.id}/${papel}-960.webp`,
      srcSet: `/media/organismos/${organismo.id}/${papel}-480.webp 480w, /media/organismos/${organismo.id}/${papel}-960.webp 960w`,
      avifSrcSet: `/media/organismos/${organismo.id}/${papel}-480.avif 480w, /media/organismos/${organismo.id}/${papel}-960.avif 960w`,
    },
    altPt: item.alt,
    legendaPt: item.legenda,
    alteracoes: 'Redimensionamento e conversão local para WebP e AVIF; conteúdo visual não foi gerado por IA.',
  };
}

function scaleSvg(organismo: OrganismoAtlas): string {
  const medidaPrincipal = organismo.medidas.itens.find(({ tipo }) => tipo === 'envergadura')
    ?? organismo.medidas.itens.find(({ tipo }) => tipo === 'comprimento')
    ?? organismo.medidas.itens[0];
  const maxLength = medidaPrincipal.unidade === 'm' ? medidaPrincipal.max : 1;
  const width = 790;
  const unitLabel = medidaPrincipal.unidade;
  const ticks = 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="360" viewBox="0 0 960 360" role="img" aria-labelledby="title desc">
  <title id="title">Escala aproximada de ${organismo.nomeCientifico}</title>
  <desc id="desc">Régua educativa mostra a medida máxima publicada para ${organismo.nomePt}: ${maxLength} ${unitLabel}.</desc>
  <rect width="960" height="360" rx="24" fill="#f1ead7"/>
  <text x="56" y="66" font-family="system-ui, sans-serif" font-size="18" letter-spacing="2" fill="#875711">ESCALA APROXIMADA</text>
  <text x="56" y="118" font-family="Georgia, serif" font-size="34" font-weight="700" fill="#34362f">${organismo.nomeCientifico}</text>
  <text x="56" y="154" font-family="system-ui, sans-serif" font-size="22" fill="#5f6258">${medidaPrincipal.rotuloPt}: até ${maxLength.toLocaleString('pt-BR')} ${unitLabel}</text>
  <path d="M70 228H${70 + width}" stroke="#3f4939" stroke-width="8" stroke-linecap="round"/>
  ${Array.from({ length: ticks + 1 }, (_, index) => {
    const x = 70 + (width / ticks) * index;
    const tall = index % 5 === 0;
    return `<path d="M${x} 212V${tall ? 252 : 242}" stroke="#3f4939" stroke-width="${tall ? 4 : 2}"/><text x="${x}" y="${tall ? 280 : 268}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${tall ? 17 : 14}" fill="#5f6258">${((maxLength / ticks) * index).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</text>`;
  }).join('')}
  <text x="870" y="280" font-family="system-ui, sans-serif" font-size="17" fill="#5f6258">${unitLabel}</text>
  <text x="904" y="330" text-anchor="end" font-family="system-ui, sans-serif" font-size="16" fill="#73766d">Régua proporcional; sem silhueta anatômica inventada</text>
</svg>`;
}

function createScaleAsset(organismo: OrganismoAtlas): MediaAsset {
  const targetDir = resolve(outputRoot, organismo.id);
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(resolve(targetDir, 'escala.svg'), scaleSvg(organismo), 'utf8');
  const medidaPrincipal = organismo.medidas.itens.find(({ tipo }) => tipo === 'envergadura')
    ?? organismo.medidas.itens.find(({ tipo }) => tipo === 'comprimento')
    ?? organismo.medidas.itens[0];
  const medida = medidaPrincipal.max;
  return {
    id: `${organismo.id}-escala`,
    entidade: { tipo: 'organismo', id: organismo.id },
    papel: 'escala',
    representacao: 'diagrama',
    titulo: `Escala aproximada de ${organismo.nomePt}`,
    autor: 'Equipe editorial Dinopad',
    fonte: 'Dinopad, a partir das medidas citadas na ficha',
    urlFonte: sourceHome,
    licenca: 'MIT',
    urlLicenca: allowedLicenseUrls.MIT,
    acessadoEm: accessedAt,
    arquivos: { src: `/media/organismos/${organismo.id}/escala.svg` },
    altPt: `Diagrama compara ${organismo.nomePt}, com até ${medida} ${medidaPrincipal.unidade}, a uma pessoa de 1,7 metro.`,
    legendaPt: `Escala educativa calculada a partir da maior medida da ficha. A silhueta é esquemática e não representa detalhes anatômicos.`,
    alteracoes: 'Diagrama vetorial original do projeto; medidas arredondadas e silhueta deliberadamente esquemática.',
  };
}

function morphologySvg(organismo: OrganismoAtlas): string {
  const medida = organismo.medidas.itens[0];
  const estrutura = medida.rotuloPt.toLocaleLowerCase('pt-BR');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="560" viewBox="0 0 960 560" role="img" aria-labelledby="title desc">
  <title id="title">Morfologia esquemática de ${organismo.nomeCientifico}</title>
  <desc id="desc">Diagrama educativo identifica caule, estruturas foliares e estrutura reprodutiva sem reconstruir cores.</desc>
  <rect width="960" height="560" rx="24" fill="#f1ead7"/>
  <g fill="none" stroke="#3f4939" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">
    <path d="M476 462C472 388 484 301 480 222C477 160 469 109 482 72"/>
    <path d="M477 260C402 247 354 221 310 181M480 236C551 218 604 185 644 137"/>
    <path d="M475 327C394 327 344 310 284 271M479 302C560 294 622 266 682 224"/>
  </g>
  <g fill="#6f7257" stroke="#3f4939" stroke-width="4">
    <ellipse cx="293" cy="171" rx="60" ry="22" transform="rotate(24 293 171)"/><ellipse cx="657" cy="125" rx="61" ry="22" transform="rotate(-27 657 125)"/>
    <ellipse cx="268" cy="261" rx="66" ry="24" transform="rotate(18 268 261)"/><ellipse cx="701" cy="213" rx="66" ry="24" transform="rotate(-18 701 213)"/>
    <ellipse cx="482" cy="60" rx="29" ry="50"/>
  </g>
  <path d="M420 462H542" stroke="#9a5738" stroke-width="8" stroke-linecap="round"/>
  <g font-family="system-ui, sans-serif" font-size="21" fill="#34362f">
    <text x="555" y="74">estrutura reprodutiva</text><path d="M545 81L512 72" stroke="#73766d" stroke-width="2"/>
    <text x="714" y="293">folha ou ramo foliar</text><path d="M706 278L655 258" stroke="#73766d" stroke-width="2"/>
    <text x="550" y="414">caule ou eixo</text><path d="M544 403L492 381" stroke="#73766d" stroke-width="2"/>
  </g>
  <text x="56" y="506" font-family="Georgia, serif" font-size="29" font-style="italic" font-weight="700" fill="#34362f">${organismo.nomeCientifico}</text>
  <text x="904" y="506" text-anchor="end" font-family="system-ui, sans-serif" font-size="19" fill="#5f6258">${estrutura}: ${medida.min}–${medida.max} ${medida.unidade}</text>
  <text x="904" y="538" text-anchor="end" font-family="system-ui, sans-serif" font-size="15" fill="#73766d">Forma simplificada; proporções e partes variam conforme a preservação</text>
</svg>`;
}

function createMorphologyAsset(organismo: OrganismoAtlas): MediaAsset {
  const targetDir = resolve(outputRoot, organismo.id);
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(resolve(targetDir, 'morfologia.svg'), morphologySvg(organismo), 'utf8');
  return {
    id: `${organismo.id}-morfologia`,
    entidade: { tipo: 'organismo', id: organismo.id },
    papel: 'morfologia',
    representacao: 'diagrama',
    titulo: `Morfologia esquemática de ${organismo.nomePt}`,
    autor: 'Equipe editorial Dinopad',
    fonte: 'Dinopad, a partir das fontes morfológicas citadas na ficha',
    urlFonte: sourceHome,
    licenca: 'MIT',
    urlLicenca: allowedLicenseUrls.MIT,
    acessadoEm: accessedAt,
    arquivos: { src: `/media/organismos/${organismo.id}/morfologia.svg` },
    altPt: `Diagrama identifica caule, estruturas foliares e estrutura reprodutiva de ${organismo.nomePt}.`,
    legendaPt: 'Diagrama morfológico educativo. A forma é simplificada e não reconstrói cores nem partes ausentes.',
    alteracoes: 'Diagrama vetorial original do projeto, baseado nas medidas e descrições citadas; não gerado por IA.',
  };
}

function createThirdAsset(organismo: OrganismoAtlas): MediaAsset {
  return organismo.reino === 'plantae' ? createMorphologyAsset(organismo) : createScaleAsset(organismo);
}

async function ensureThumbnails(asset: MediaAsset): Promise<MediaAsset> {
  if (!['evidencia', 'interpretacao'].includes(asset.papel) || asset.arquivos.src.endsWith('.svg')) return asset;
  const sourcePath = resolve(repoRoot, 'public', asset.arquivos.src.replace(/^\//, ''));
  if (asset.entidade.tipo !== 'organismo') return asset;
  const targetDir = resolve(outputRoot, asset.entidade.id);
  const base = asset.papel;
  await Promise.all([
    sharp(sourcePath).resize({ width: 96, height: 96, fit: 'cover' }).webp({ quality: 78 }).toFile(resolve(targetDir, `${base}-96.webp`)),
    sharp(sourcePath).resize({ width: 192, height: 192, fit: 'cover' }).webp({ quality: 80 }).toFile(resolve(targetDir, `${base}-192.webp`)),
  ]);
  return {
    ...asset,
    arquivos: {
      ...asset.arquivos,
      miniaturaSrcSet: `/media/organismos/${asset.entidade.id}/${base}-96.webp 96w, /media/organismos/${asset.entidade.id}/${base}-192.webp 192w`,
    },
  };
}

const existingMedia = JSON.parse(readFileSync(metadataPath, 'utf8')) as MediaAsset[];
const completedIds = new Set(
  catalogo.organismos
    .filter((organismo) => existingMedia.filter((item) => item.entidade.tipo === 'organismo' && item.entidade.id === organismo.id).length === 3)
    .map(({ id }) => id),
);
const media: MediaAsset[] = existingMedia.filter((item) => item.entidade.tipo !== 'organismo' || completedIds.has(item.entidade.id));
const refreshCuratedRequested = process.argv.includes('--refresh-curated');
const onlyIndex = process.argv.indexOf('--only');
const onlyOrganismId = onlyIndex >= 0 ? process.argv[onlyIndex + 1] : undefined;
mkdirSync(outputRoot, { recursive: true });
for (const [index, organismo] of catalogo.organismos.entries()) {
  const refreshCurated = refreshCuratedRequested
    && (!onlyOrganismId || organismo.id === onlyOrganismId)
    && (Boolean(curatedCommonsTitles[organismo.id]) || organismo.id === 'dimetrodon');
  if (completedIds.has(organismo.id) && !refreshCurated) {
    for (let mediaIndex = 0; mediaIndex < media.length; mediaIndex += 1) {
      if (media[mediaIndex].entidade.tipo === 'organismo' && media[mediaIndex].entidade.id === organismo.id) media[mediaIndex] = await ensureThumbnails(media[mediaIndex]);
    }
    const terceiro = createThirdAsset(organismo);
    const thirdIndex = media.findIndex(({ id }) => id === terceiro.id);
    if (thirdIndex >= 0) media[thirdIndex] = terceiro;
    else media.push(terceiro);
    console.log(`[${index + 1}/${catalogo.organismos.length}] ${organismo.nomeCientifico}: imagens preservadas; diagrama e miniaturas atualizados.`);
    continue;
  }
  if (refreshCurated) {
    for (let mediaIndex = media.length - 1; mediaIndex >= 0; mediaIndex -= 1) {
      if (media[mediaIndex].entidade.tipo === 'organismo' && media[mediaIndex].entidade.id === organismo.id) media.splice(mediaIndex, 1);
    }
  }
  const manual = manualMedia[organismo.id];
  if (manual) {
    media.push(await ensureThumbnails(await downloadManualVariant(manual.evidencia, organismo, 'evidencia')));
    media.push(await ensureThumbnails(await downloadManualVariant(manual.interpretacao, organismo, 'interpretacao')));
  } else {
    const usedPageIds = new Set<number>();
    const evidence = await findCommonsPage(organismo, 'evidencia', usedPageIds);
    usedPageIds.add(evidence.page.pageid);
    media.push(await ensureThumbnails(await downloadVariant(evidence.page, organismo, 'evidencia', evidence.strictMatch)));
    const interpretation = await findCommonsPage(organismo, 'interpretacao', usedPageIds);
    usedPageIds.add(interpretation.page.pageid);
    media.push(await ensureThumbnails(await downloadVariant(interpretation.page, organismo, 'interpretacao', interpretation.strictMatch)));
  }
  media.push(createThirdAsset(organismo));
  writeFileSync(metadataPath, `${JSON.stringify(media, null, 2)}\n`, 'utf8');
  console.log(`[${index + 1}/${catalogo.organismos.length}] ${organismo.nomeCientifico}: evidência, interpretação e ${organismo.reino === 'plantae' ? 'morfologia' : 'escala'}.`);
}

writeFileSync(metadataPath, `${JSON.stringify(media, null, 2)}\n`, 'utf8');
console.log(`${media.length} mídias locais geradas e documentadas em ${metadataPath}.`);
