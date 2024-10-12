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
  PlusIcon,
  Upload,
  X,
  Sun,
  Moon,
  EditIcon,
  XIcon,
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
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes"
import { EditSaveUrl } from "@/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export type ActiveTab = "grid" | "list";

interface NavProps {
  workflows: { name: string; urls: number }[];
  activeWorkflow: number;
  activeTab: ActiveTab;
  setActiveTab: Dispatch<SetStateAction<ActiveTab>>;
  urls: { title: string; url: string; image: string }[];
  addNewUrl2Workflow: (imageUrl: string, urlName: string, urlTitle: string) => void;
  renameWorkflow: (newName: string) => void;
  deleteWorkflow: () => void;
  searchValueState: [string, Dispatch<SetStateAction<string>>] 
}

export function Nav({
  workflows,
  activeWorkflow,
  activeTab,
  setActiveTab,
  urls,
  addNewUrl2Workflow,
  renameWorkflow,
  deleteWorkflow,
  searchValueState,
}: NavProps) {

  const { setTheme } = useTheme()


  const imageUrlState = useState('');
  const [imageUrl, setImageUrl] = imageUrlState;
  const urlNameState = useState('');
  const [urlName, setUrlName] = urlNameState;
  const urlTitleState = useState('');
  const [urlTitle, setUrlTitle] = urlTitleState;

  const [searchValue, setSearchValue] = searchValueState;


  const [workflowName, setWorkflowName] = useState('');
  const [editOpen, setEditOpen] = useState<boolean|undefined>(undefined);


  const openAllUrls = () => {
    urls.forEach((url) => window.open(url.url, "_blank"));
    // TODO: you have modify this manually after making the build/export
    // const ur = urls.map((url) => url.url);
    // chrome.windows.create(
      // {
        // url: ur,
        // type: 'popup'
      // }
    // );

  };

  const addNewUrlHandler = ()=>{
    addNewUrl2Workflow(imageUrl, urlName, urlTitle)
  }

  const deleteWorkflowHandler = ()=>{
    deleteWorkflow();
    setEditOpen(false);
  }
  const renameWorkflowHandler = ()=>{
    renameWorkflow(workflowName);
    setEditOpen(false);
  }

  // interface Tag {
  //   id: number;
  //   text: string;
  // }
  // const [tags, setTags] = useState<Tag[]>([]);
  // const [newTag, setNewTag] = useState("");

  // const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter" && newTag.trim() !== "") {
  //     setTags([...tags, { id: Date.now(), text: newTag.trim() }]);
  //     setNewTag("");
  //   }
  // };

  // const removeTag = (idToRemove: number) => {
  //   setTags(tags.filter((tag) => tag.id !== idToRemove));
  // };


  return (
    <header className="bg-background border-b border-muted">
      <div className="flex items-center justify-between px-6 py-4 max-w-full">
        <h2 className="text-2xl font-semibold text-primary overflow-hidden text-nowrap text-ellipsis mr-2 max-w-xl ">
          {workflows[activeWorkflow].name}
        </h2>
        <div className="flex items-center space-x-4">
          <Tooltip>
            <Dialog onOpenChange={() => {setWorkflowName(workflows[activeWorkflow].name); setEditOpen(undefined);}} open={editOpen}>
              <DialogTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <EditIcon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Workflow Settings</DialogTitle>
                  <DialogDescription>
                    Customize your workflow settings and organization
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="workflow-name">Workflow Name</Label>
                    <Input
                      id="workflow-name"
                      value={workflowName}
                      onChange={(e) => setWorkflowName(e.target.value)}
                      placeholder="Enter workflow name"
                    />
                  </div>
                  {/* <div className="grid gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge key={tag.id} className="flex items-center gap-1">
                          {tag.text}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => removeTag(tag.id)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <Input
                      id="tags"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Add tags (press Enter)"
                    />
                  </div> */}
                </div>

                <DialogFooter className="flex justify-between">
                  <Button variant="destructive" onClick={deleteWorkflowHandler}>Delete Workflow</Button>
                  <Button type="submit" onClick={renameWorkflowHandler}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </TooltipTrigger>
            <TooltipContent>Theme</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("grid")}
          >
            <Grid className="w-4 h-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={activeTab === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("list")}
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search URLs..."
              className="pl-10 w-64"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={openAllUrls}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open All
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open all URLs in this workflow</TooltipContent>
          </Tooltip>

          <EditSaveUrl
            imageUrlState={imageUrlState}
            urlNameState={urlNameState}
            urlTitleState={urlTitleState}
            callback={addNewUrlHandler}
          >
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add URL
            </Button>
          </EditSaveUrl>
        </div>
      </div>
    </header>
  );
}
