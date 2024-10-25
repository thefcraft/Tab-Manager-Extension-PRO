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
  Download,
  Import
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
import { Item, ItemCollection, ItemStorage } from "@/app/db";

function getFileNameSuffix() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day =`${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  const seconds = `${date.getSeconds()}`.padStart(2, '0');
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}



const isItemCollection = (data: any): data is ItemCollection => {
  return (
    data && 
    typeof data === 'object' && 
    !Array.isArray(data) && 
    Object.entries(data).every(([key, value]) =>
      Array.isArray(value) &&
      value.every(item =>
        typeof item.title === 'string' &&
        typeof item.url === 'string' &&
        typeof item.image === 'string'
      )
    )
  );
};

function importFromFile(event: React.ChangeEvent<HTMLInputElement>, key_override?: string){
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string;
      const json: ItemCollection = JSON.parse(text);
      // Validate the parsed JSON against the ItemCollection type
      if (isItemCollection(json)) {
        // setJsonData(json);
        // setError(null);
        // console.log(json);
        Object.entries(json).forEach(([key, value]) => {
            if(key_override)
              value.every(item => ItemStorage.addItem(key_override, item))
            else{
              ItemStorage.addItem(key);
              value.every(item => ItemStorage.addItem(key, item))
            }
          }
        )
        window.location.reload();
      } else {
        alert('The uploaded file does not match the expected structure.');
        // setError('Invalid JSON structure');
        // setJsonData(null);
      }
    } catch (err) {
      alert(`Invalid JSON file, Error ${err}`);
      // setError('Invalid JSON file');
      // setJsonData(null);
    }
  };
  reader.onerror = () => {
    alert('Error reading file');
    // setError('Error reading file');
    // setJsonData(null);
  };
  reader.readAsText(file); 
}

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
    // onClick:()=>{d.forEach(e=>window.open(e.url,"_blank"))}
    // onClick:()=>{const ur=d.map((url)=>url.url);chrome.windows.create({url:ur})}
    // const ur = urls.map((url) => url.url);
    // chrome.windows.create(
      // {
        // url: ur,
        // type: 'popup'
      // }
    // );

  };

  const downloadWorkflow = ()=>{
    const data = {
      [workflows[activeWorkflow].name]: urls,
    };
    const jsonString = JSON.stringify(data, null, 2); // Convert object to JSON string
    const blob = new Blob([jsonString], { type: 'application/json' }); // Create a Blob
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    const a = document.createElement('a'); // Create an anchor element
    a.href = url;
    a.download = `backup_${workflows[activeWorkflow].name}_${getFileNameSuffix()}.json`; // Set the desired file name
    document.body.appendChild(a); // Append to body (required for Firefox)
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Release the Blob URL
  }


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
            <input
              type="file"
              accept=".json"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => importFromFile(event, workflows[activeWorkflow].name)}
              className="hidden"
              id="json-upload"
            />
            <label htmlFor="json-upload" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <TooltipTrigger asChild>
                <Import className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />    
              </TooltipTrigger>
            </label>
            <TooltipContent>Import In Workflow</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={downloadWorkflow}>
                <Download className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download Workflow</TooltipContent>
          </Tooltip>
          <Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>  
                  </TooltipTrigger>
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



export function NavHome({itemCollection}: {itemCollection: ItemCollection}){
  const { setTheme } = useTheme();
  
  const downloadWorkflowAll = ()=>{
    const jsonString = JSON.stringify(itemCollection, null, 2); // Convert object to JSON string
    const blob = new Blob([jsonString], { type: 'application/json' }); // Create a Blob
    const url = URL.createObjectURL(blob); // Create a URL for the Blob
    const a = document.createElement('a'); // Create an anchor element
    a.href = url;
    a.download = `backup_${getFileNameSuffix()}.json`; // Set the desired file name
    document.body.appendChild(a); // Append to body (required for Firefox)
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up
    URL.revokeObjectURL(url); // Release the Blob URL
  }
  return (
    <header className="bg-background border-b border-muted">
      <div className="flex items-center justify-between px-6 py-4 max-w-full">
        <h2 className="text-2xl font-semibold text-primary overflow-hidden text-nowrap text-ellipsis mr-2 max-w-xl ">
          Tab Manager Pro
        </h2>
        <div className="flex items-center space-x-4">
        <Tooltip>
          <input
            type="file"
            accept=".json"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => importFromFile(event, undefined)}
            className="hidden"
            id="json-upload"
          />
          <label htmlFor="json-upload" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">    
            <TooltipTrigger asChild>
              <Import className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            </TooltipTrigger>
          </label>
          <TooltipContent>Import Workflows</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={downloadWorkflowAll}>
              <Download className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download All Workflow</TooltipContent>
        </Tooltip>
          <Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  
                  <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                  </TooltipTrigger>
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
            <TooltipContent>Theme</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}