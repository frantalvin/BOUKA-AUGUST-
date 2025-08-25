export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  profilePictureUrl?: string;
  parentId: string | null;
}

export interface TreeNode extends Person {
  children: TreeNode[];
}
