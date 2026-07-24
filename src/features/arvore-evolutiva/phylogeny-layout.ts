import { hierarchy, tree, type HierarchyPointNode } from 'd3-hierarchy';
import type { NoFilogenetico, OrganismoAtlas } from '../../content/types';

export type PhylogenyDatum = {
  id: string;
  kind: 'node' | 'organism';
  label: string;
  scientificName: string;
  certainty: NoFilogenetico['certeza'];
  sourceIds: string[];
  hiddenDescendants: number;
  children?: PhylogenyDatum[];
};

export type PositionedDatum = HierarchyPointNode<PhylogenyDatum> & { px: number; py: number };

export function buildPhylogenyData(
  rootId: string,
  nodes: NoFilogenetico[],
  organisms: OrganismoAtlas[],
  maxDepth?: number,
): PhylogenyDatum | null {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const childrenByParent = new Map<string, NoFilogenetico[]>();
  for (const node of nodes) {
    if (!node.paiId) continue;
    childrenByParent.set(node.paiId, [...(childrenByParent.get(node.paiId) ?? []), node]);
  }
  for (const children of childrenByParent.values()) children.sort((a, b) => a.ordemVisual - b.ordemVisual || a.nomePt.localeCompare(b.nomePt, 'pt-BR'));
  const organismsByNode = new Map<string, OrganismoAtlas[]>();
  for (const organism of organisms) organismsByNode.set(organism.noFilogeneticoId, [...(organismsByNode.get(organism.noFilogeneticoId) ?? []), organism]);

  const descendantOrganismCount = (nodeId: string): number =>
    (organismsByNode.get(nodeId)?.length ?? 0)
    + (childrenByParent.get(nodeId) ?? []).reduce((sum, child) => sum + descendantOrganismCount(child.id), 0);

  const visit = (nodeId: string, depth: number): PhylogenyDatum | null => {
    const node = nodeById.get(nodeId);
    if (!node) return null;
    const taxonChildren = childrenByParent.get(nodeId) ?? [];
    const directOrganisms = organismsByNode.get(nodeId) ?? [];
    const shouldStop = maxDepth !== undefined && depth >= maxDepth;
    const children = shouldStop ? [] : [
      ...taxonChildren.flatMap((child) => {
        const result = visit(child.id, depth + 1);
        return result ? [result] : [];
      }),
      ...directOrganisms.map((organism): PhylogenyDatum => ({
        id: organism.id,
        kind: 'organism',
        label: organism.nomePt,
        scientificName: organism.nomeCientifico,
        certainty: organism.nivelEvidencia === 'em-debate' ? 'em-debate' : organism.nivelEvidencia === 'interpretado' ? 'provavel' : 'estabelecida',
        sourceIds: organism.fonteIds,
        hiddenDescendants: 0,
      })),
    ];
    return {
      id: node.id,
      kind: 'node',
      label: node.nomePt,
      scientificName: node.nomeCientifico,
      certainty: node.certeza,
      sourceIds: node.fonteIds,
      hiddenDescendants: shouldStop ? descendantOrganismCount(nodeId) : 0,
      children,
    };
  };
  return visit(rootId, 0);
}

export function calculatePhylogenyLayout(data: PhylogenyDatum, orientation: 'top' | 'left') {
  const root = hierarchy(data);
  const layout = tree<PhylogenyDatum>().nodeSize(orientation === 'left' ? [48, 190] : [112, 124]);
  const result = layout(root);
  const minX = Math.min(...result.descendants().map(({ x }) => x));
  const maxX = Math.max(...result.descendants().map(({ x }) => x));
  const maxY = Math.max(...result.descendants().map(({ y }) => y));
  const padding = orientation === 'left' ? 76 : 64;
  const nodes = result.descendants().map((node) => Object.assign(node, {
    px: orientation === 'left' ? node.y + padding : node.x - minX + padding,
    py: orientation === 'left' ? node.x - minX + padding : node.y + padding,
  })) as PositionedDatum[];
  return {
    nodes,
    links: result.links(),
    width: orientation === 'left' ? maxY + padding * 2 + 210 : maxX - minX + padding * 2,
    height: orientation === 'left' ? maxX - minX + padding * 2 : maxY + padding * 2 + 110,
  };
}
