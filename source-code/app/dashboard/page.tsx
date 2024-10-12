"use client";
import { useState, useEffect } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SideBar } from "@/components/sidebar";
import { Nav, ActiveTab } from "@/components/nav";

import { EditSaveUrl } from "@/components/dialog";
import { useToast } from "@/hooks/use-toast";
import { Item, ItemCollection, ItemStorage } from "@/app/db";

export default function Component() {
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [activeTab, setActiveTab] = useState<ActiveTab>("grid");
  const [itemCollection, setItemCollection] = useState<ItemCollection>({});

  const [workflows, setWorkflows] = useState<{name: string;urls: number;}[]>([]);
  const [urls, setUrls] = useState<{title: string;url: string;image: string;}[]>([]);

  const { toast } = useToast()

  useEffect(() => {
    const itemCollection = ItemStorage.getItems()
    setItemCollection(itemCollection);
    const wflows = (Object.keys(itemCollection).map((key) => ({
        name: key,
        urls: itemCollection[key].length,
    })));
    setWorkflows(wflows);
    if(wflows.length !== 0) setUrls(itemCollection[wflows[activeWorkflow].name]);
  }, []);

  const imageUrlState = useState('');
  const [imageUrl, setImageUrl] = imageUrlState;
  const urlNameState = useState('');
  const [urlName, setUrlName] = urlNameState;
  const urlTitleState = useState('');
  const [urlTitle, setUrlTitle] = urlTitleState;

  const searchValueState = useState('');
  const [searchValue, setSearchValue] = searchValueState;

  const toggleDarkMode = () => {};
  const handleDeleteUrl = (key: number) => {};

  const createNewWorkflow = (newWorkflowName: string) => {
    ItemStorage.addItem(newWorkflowName);
    if(newWorkflowName in itemCollection) return toast({
      title: "Uh oh! Something went wrong.",
      description: `Workflow ${newWorkflowName} already exists`,
      variant: "destructive"
    });
    setActiveWorkflow(workflows.length);
    setItemCollection({...itemCollection, [newWorkflowName]: []});
    setWorkflows([...workflows, {name: newWorkflowName, urls: 0}]);
    setUrls([]);
  }
  const setActiveWorkflowHandler = (key: number) => {
    if(key < 0 || key >= workflows.length) return toast({
      title: "Uh oh! Something went wrong.",
      description: `list index ${key} out of range`,
      variant: "destructive"
    });
    setActiveWorkflow(key);
    if(workflows[key].urls === 0) setUrls([]); // why this raises an error at starting
    setUrls(itemCollection[workflows[key].name]);
  }

  const renameWorkflow = (newName: string) => {
    ItemStorage.updateItemKey(workflows[activeWorkflow].name, newName);
   
    const itemCollection = ItemStorage.getItems()
    setItemCollection(itemCollection);
    const wflows = (Object.keys(itemCollection).map((key) => ({
        name: key,
        urls: itemCollection[key].length,
    })));
    setWorkflows(wflows);
    setActiveWorkflow(workflows.length - 1);
    if(wflows.length !== 0) setUrls(itemCollection[wflows[activeWorkflow].name]);
  }
  const deleteWorkflow = ()=>{
    ItemStorage.deleteItemKey(workflows[activeWorkflow].name);
   
    const itemCollection = ItemStorage.getItems()
    setItemCollection(itemCollection);
    const wflows = (Object.keys(itemCollection).map((key) => ({
        name: key,
        urls: itemCollection[key].length,
    })));
    setWorkflows(wflows);
    setActiveWorkflow(-1);
    setUrls([]);
  }

  const renameUrl = (key: number) => {
    ItemStorage.updateItem(workflows[activeWorkflow].name, key, {title: urlTitle, url: urlName, image: imageUrl});

    const itemCollection = ItemStorage.getItems()
    setItemCollection(itemCollection);
    const wflows = (Object.keys(itemCollection).map((key) => ({
        name: key,
        urls: itemCollection[key].length,
    })));
    setWorkflows(wflows);
    if(wflows.length !== 0) setUrls(itemCollection[wflows[activeWorkflow].name]);
  }  
  const deleteUrl = (key: number) => {
    ItemStorage.deleteItem(workflows[activeWorkflow].name, key);

    const itemCollection = ItemStorage.getItems()
    setItemCollection(itemCollection);
    const wflows = (Object.keys(itemCollection).map((key) => ({
        name: key,
        urls: itemCollection[key].length,
    })));
    setWorkflows(wflows);
    if(wflows.length !== 0) setUrls(itemCollection[wflows[activeWorkflow].name]);
  }

  const addNewUrl2Workflow = (imageUrl: string, urlName: string, urlTitle: string) => {
    const name = workflows[activeWorkflow].name;
    const item = {title: urlTitle, url: urlName, image: imageUrl};
    const isDone = ItemStorage.addItem(name, item);
    if(!isDone) return toast({
      title: "Uh oh! Something went wrong.",
      description: `Url ${urlName} already exists`,
      variant: "destructive"
    });
    
    const itemCollection = ItemStorage.getItems()
    setItemCollection(itemCollection);
    const wflows = (Object.keys(itemCollection).map((key) => ({
        name: key,
        urls: itemCollection[key].length,
    })));
    setWorkflows(wflows);
    if(wflows.length !== 0) setUrls(itemCollection[wflows[activeWorkflow].name]);
    
  }

  const filteredUrls = urls.filter(url => 
    url.title.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-50 text-gray-900 dark:text-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <SideBar
          workflows={workflows}
          setActiveWorkflowHandler={setActiveWorkflowHandler}
          activeWorkflow={activeWorkflow}
          createNewWorkflow={createNewWorkflow}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          {!(activeWorkflow < 0 || activeWorkflow >= workflows.length) && 
            <Nav
              workflows={workflows}
              activeWorkflow={activeWorkflow}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              urls={urls}
              addNewUrl2Workflow={addNewUrl2Workflow}
              renameWorkflow={renameWorkflow}
              deleteWorkflow={deleteWorkflow}
              searchValueState={searchValueState}
            />
          }
          

          {/* URL Grid */}
          <ScrollArea className="flex-1 p-6">
            <div
              className={cn(
                activeTab === "list"
                  ? "flex flex-col"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                "gap-6"
              )}
            >
              {filteredUrls.map((url, key) => (
                <div
                  key={key}
                  className={cn(
                    "bg-background rounded-lg shadow-md overflow-hidden border border-muted transition-all hover:shadow-lg",
                    activeTab === "list" ? "flex" : ""
                  )}
                >
                  <a href={url.url}
                      target="_blank"
                      rel="noopener noreferrer">
                    <img
                      src={url.image}
                      alt={url.title}
                      className={cn(
                        "w-full h-40 object-cover cursor-pointer",
                        activeTab === "list" ? "w-60 min-w-60" : ""
                      )}
                    />
                  </a>
                  <div className="p-4 flex flex-col  justify-between">
                    <h3 className="font-semibold text-lg mb-2 overflow-hidden overflow-ellipsis text-nowrap">
                      {url.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 overflow-hidden overflow-ellipsis text-nowrap">
                      {url.url}
                    </p>
                    <div
                      className={cn(
                        "flex items-center",
                        activeTab === "list" ? "" : "justify-between"
                      )}
                    >
                      <Button variant="link" asChild>
                        <a
                          href={url.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Open
                        </a>
                      </Button>
                      <div className="flex space-x-2">
                        <EditSaveUrl
                          imageUrlState={imageUrlState}
                          urlNameState={urlNameState}
                          urlTitleState={urlTitleState}
                          callback={() => renameUrl(key)}
                          title="Edit URL"
                          tooltip="Edit URL"
                          defaultImageUrl={url.image}
                          defaultUrlName={url.url}
                          defaultUrlTitle={url.title}
                        >
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </EditSaveUrl>

                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
                                  <Trash2 className="w-4 h-4" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>Delete URL</TooltipContent>
                            </Tooltip>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this url from the workflow
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteUrl(key)} className="bg-red-500 hover:bg-red-700">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {(activeWorkflow < 0 || activeWorkflow >= workflows.length) && 
                <div className="w-full h-full flex justify-center items-center">Open any workflow or Create new workflow</div>
            }
            {urls.length === 0 && !(activeWorkflow < 0 || activeWorkflow >= workflows.length) && 
              <div className="w-full h-full flex justify-center items-center">Add new Url to workflow</div>
            }
          </ScrollArea>
        </div>
      </div>
    </TooltipProvider>
  );
}
