import { getTreeData } from '#firebase-client.ts';
import type { TreeData } from '#shared/types/tree.type.ts';

export const getTreeService = async (personId: string): Promise<TreeData> => {
  const treeData = await getTreeData(personId);
  return treeData;
};
