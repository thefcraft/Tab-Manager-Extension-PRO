"use client";
import { useState, Dispatch, SetStateAction } from "react";
import {
  Search,
  Plus,
  Settings,
  HelpCircle,
  ExternalLink,
  Edit,
  Trash2,
  Grid,
  List,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface SideBarProps {
  workflows: {
    name: string;
    urls: number;
  }[];
  activeWorkflow: number;
  setActiveWorkflowHandler: (key: number) => void;
  createNewWorkflow: (newWorkflowName: string) => void;
}

export function SideBar({
  workflows,
  activeWorkflow,
  setActiveWorkflowHandler,
  createNewWorkflow
}: SideBarProps) {
  // const [isOpen, setIsOpen] = useState(false);
  // const toggleSidebar = () => {
  //   setIsOpen(!isOpen);
  // };
  const [newWorkflowIsOpen, setNewWorkflowIsOpen] = useState<boolean|undefined>(undefined);
  const [newWorkflowName, setNewWorkflowName] = useState('');
  return (
    <div className="w-64 bg-background border-r border-muted flex flex-col-reverse">
      <div className="p-4">
        <Dialog open={newWorkflowIsOpen} onOpenChange={()=>setNewWorkflowIsOpen(undefined)}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Workflow</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="workflow-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="workflow-name"
                  placeholder="Workflow Title"
                  className="col-span-3"
                  autoComplete="off"
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  value={newWorkflowName}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={newWorkflowName === ''} onClick={() => {setNewWorkflowIsOpen(false); createNewWorkflow(newWorkflowName);}}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-full">
        <nav className={workflows.length === 0 ? "" : "space-y-1 p-2"}>
          {workflows.map((workflow, key) => (
                <Button
                  key={key}
                  variant={activeWorkflow === key ? "secondary" : "ghost"}
                  className="w-full justify-start mb-0.5"
                  onClick={() => setActiveWorkflowHandler(key)}
                >
                  <span className="max-w-full overflow-hidden mr-2 text-ellipsis">
                    {workflow.name}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {workflow.urls} items
                  </span>
                </Button>
          ))}
        </nav>
        {workflows.length === 0 && (
          <div className="w-full h-full flex justify-center items-center">
            Create New Workflow
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
