
"use client";

import type { Person, TreeNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { Pencil, BookUser } from "lucide-react";

interface FamilyTreeProps {
  roots: TreeNode[];
  searchQuery: string;
  isLoading: boolean;
  onEditMember: (person: Person) => void;
  onGenerateBio: (person: Person) => void;
}

const MemberCard = ({ node, searchQuery, onEditMember, onGenerateBio }: { node: TreeNode; searchQuery: string; onEditMember: (person: Person) => void; onGenerateBio: (person: Person) => void; }) => {
  const isMatch = searchQuery.length > 1 &&
    `${node.firstName} ${node.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <div className="flex justify-center">
      <Card
        className={cn(
          "w-36 md:w-48 text-center shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative group",
          isMatch && "ring-2 ring-accent ring-offset-2 ring-offset-background"
        )}
      >
        <CardHeader className="pb-2">
          <Avatar className="mx-auto h-16 w-16 md:h-20 md:w-20 border-2 border-primary/50">
            <AvatarImage 
              src={node.profilePictureUrl || undefined} 
              alt={`${node.firstName} ${node.lastName}`}
              data-ai-hint="portrait person"
            />
            <AvatarFallback>{node.firstName[0]}{node.lastName[0]}</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent className="p-2 md:p-4 pt-0">
          <CardTitle className="text-sm md:text-base font-headline">{node.firstName} {node.lastName}</CardTitle>
          <CardDescription className="text-xs">Né(e) le: {node.dob}</CardDescription>
        </CardContent>
         <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                  e.stopPropagation();
                  onEditMember(node);
              }}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Modifier</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                  e.stopPropagation();
                  onGenerateBio(node);
              }}
            >
              <BookUser className="h-4 w-4" />
              <span className="sr-only">Générer une biographie</span>
            </Button>
          </div>
      </Card>
    </div>
  );
};

const TreeNodeComponent = ({ node, searchQuery, onEditMember, onGenerateBio }: { node: TreeNode; searchQuery: string, onEditMember: (person: Person) => void; onGenerateBio: (person: Person) => void; }) => {
  return (
    <li className="flex flex-col items-center">
      <MemberCard node={node} searchQuery={searchQuery} onEditMember={onEditMember} onGenerateBio={onGenerateBio} />
      {node.children && node.children.length > 0 && (
        <ul className="flex">
          {node.children.map((child) => (
            <TreeNodeComponent key={child.id} node={child} searchQuery={searchQuery} onEditMember={onEditMember} onGenerateBio={onGenerateBio} />
          ))}
        </ul>
      )}
    </li>
  );
};

const LoadingSkeleton = () => (
    <div className="flex flex-col items-center space-y-4">
        <Skeleton className="h-40 w-48 rounded-lg" />
        <div className="w-px h-8 bg-muted" />
        <div className="flex space-x-8">
            <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-40 w-48 rounded-lg" />
            </div>
            <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-40 w-48 rounded-lg" />
            </div>
        </div>
    </div>
)

export function FamilyTree({ roots, searchQuery, isLoading, onEditMember, onGenerateBio }: FamilyTreeProps) {
  if (isLoading) {
    return <div className="flex justify-center items-center h-full w-full"><LoadingSkeleton /></div>;
  }
  
  if (!roots || roots.length === 0) {
    return (
      <div className="text-center text-muted-foreground w-full self-center">
        <p>Votre arbre généalogique est vide.</p>
        <p>Cliquez sur "Ajouter un membre" pour commencer à construire votre héritage.</p>
      </div>
    );
  }

  return (
    <div className="tree flex justify-start md:justify-center w-max">
      <ul className="flex">
        {roots.map((root) => (
          <TreeNodeComponent key={root.id} node={root} searchQuery={searchQuery} onEditMember={onEditMember} onGenerateBio={onGenerateBio}/>
        ))}
      </ul>
    </div>
  );
}
