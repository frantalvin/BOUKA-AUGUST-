import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Person, TreeNode } from "@/lib/types";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildTree(people: Person[]): TreeNode[] {
  if (!people || people.length === 0) return [];

  const peopleMap = new Map<string, TreeNode>();
  people.forEach(person => peopleMap.set(person.id, { ...person, children: [] }));

  const roots: TreeNode[] = [];

  people.forEach(person => {
    const node = peopleMap.get(person.id)!;
    if (person.parentId && peopleMap.has(person.parentId)) {
      const parentNode = peopleMap.get(person.parentId)!;
      parentNode.children.push(node);
      parentNode.children.sort((a, b) => new Date(a.dob).getTime() - new Date(b.dob).getTime());
    } else {
      roots.push(node);
    }
  });

  roots.sort((a, b) => new Date(a.dob).getTime() - new Date(b.dob).getTime());
  
  return roots;
}
