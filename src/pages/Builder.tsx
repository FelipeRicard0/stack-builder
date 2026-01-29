import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Shuffle,
  Save,
  Share2,
  ChevronRight,
  Settings,
  Eye,
  Folder,
  FileCode,
  ChevronDown,
  Terminal,
} from "lucide-react";
import { categories, presets, type Technology } from "@/lib/stack-data";
import {
  generateCommands,
  generateSingleCommand,
} from "@/lib/command-generator";
import { cn } from "@/lib/utils";
import CommandStep from "@/components/command-step";
import { ModeToggle } from "@/components/mode-toggle";

function CategorySection({
  category,
  selections,
  onSelect,
  isIncompatible,
}: {
  category: (typeof categories)[number];
  selections: Set<string>;
  onSelect: (tech: Technology, category: (typeof categories)[number]) => void;
  isIncompatible: (tech: Technology) => boolean;
}) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <ChevronRight className="text-muted-foreground size-4" />
        <h2 className="text-foreground font-mono text-sm font-medium">
          {category.name}
        </h2>
        {category.singleSelect && (
          <Badge variant="outline" className="text-[10px]">
            Select one
          </Badge>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {category.technologies.map((tech) => {
          const isSelected = selections.has(tech.id);
          const incompatible = isIncompatible(tech);
          const isNone = tech.id.startsWith("no-");

          return (
            <button
              key={tech.id}
              type="button"
              onClick={() => onSelect(tech, category)}
              disabled={incompatible}
              className={cn(
                "group relative flex cursor-pointer flex-col items-start gap-2 border p-4 text-left transition-all",
                isSelected
                  ? "border-foreground/30 bg-foreground/5"
                  : "border-border bg-card hover:border-border hover:bg-secondary/50",
                incompatible && "cursor-not-allowed opacity-40",
                isNone && !isSelected && "border-dashed",
              )}
            >
              <div className="flex w-full items-center gap-3">
                {tech.icon && (
                  <div
                    className="flex size-8 items-center justify-center text-lg"
                    style={{
                      backgroundColor: isNone
                        ? "transparent"
                        : tech.color + "20",
                    }}
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      height={20}
                      width={20}
                    />
                  </div>
                )}
                <h3 className="text-card-foreground flex-1 text-sm font-medium">
                  {tech.name}
                </h3>
                {isSelected && (
                  <div className="bg-foreground flex size-5 items-center justify-center self-start rounded-full">
                    <Check className="text-background size-3" />
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {tech.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FolderStructure({
  projectName,
  selections,
}: {
  projectName: string;
  selections: Set<string>;
}) {
  const generateStructure = () => {
    // Helper function to get the correct file extension based on TypeScript selection
    const getExt = (type: "ts" | "tsx" = "ts"): string => {
      if (selections.has("typescript")) {
        return type === "tsx" ? ".tsx" : ".ts";
      }
      return type === "tsx" ? ".jsx" : ".js";
    };

    const structure: {
      name: string;
      type: "folder" | "file";
      indent: number;
    }[] = [];

    // Root
    structure.push({
      name: projectName || "my-app",
      type: "folder",
      indent: 0,
    });

    // Determine if we have frontend
    const hasFrontend =
      selections.has("nextjs") ||
      selections.has("nuxt") ||
      selections.has("astro") ||
      selections.has("svelte") ||
      selections.has("solid") ||
      selections.has("tanstack-start") ||
      selections.has("tanstack-router") ||
      selections.has("react-router") ||
      selections.has("expo-bare") ||
      selections.has("expo-uniwind") ||
      selections.has("expo-unistyles");

    // Determine if we have backend
    const isStandaloneBackend =
      selections.has("hono") ||
      selections.has("elysia") ||
      selections.has("express") ||
      selections.has("fastify");

    // Frontend structure
    if (selections.has("nextjs")) {
      structure.push({ name: "src", type: "folder", indent: 1 });
      structure.push({ name: "app", type: "folder", indent: 2 });
      structure.push({
        name: `layout${getExt("tsx")}`,
        type: "file",
        indent: 3,
      });
      structure.push({ name: `page${getExt("tsx")}`, type: "file", indent: 3 });
      structure.push({ name: "globals.css", type: "file", indent: 3 });
      if (selections.has("trpc") || selections.has("orpc")) {
        structure.push({ name: "api", type: "folder", indent: 3 });
        structure.push({ name: "trpc", type: "folder", indent: 4 });
        structure.push({ name: "[...trpc]", type: "folder", indent: 5 });
        structure.push({ name: `route${getExt()}`, type: "file", indent: 6 });
      }
      structure.push({ name: "components", type: "folder", indent: 2 });
      structure.push({ name: "ui", type: "folder", indent: 3 });
      structure.push({
        name: `button${getExt("tsx")}`,
        type: "file",
        indent: 4,
      });
      structure.push({ name: "lib", type: "folder", indent: 2 });
      structure.push({ name: `utils${getExt()}`, type: "file", indent: 3 });
    } else if (selections.has("nuxt")) {
      structure.push({ name: "pages", type: "folder", indent: 1 });
      structure.push({ name: "index.vue", type: "file", indent: 2 });
      structure.push({ name: "components", type: "folder", indent: 1 });
      structure.push({ name: "layouts", type: "folder", indent: 1 });
      structure.push({ name: "default.vue", type: "file", indent: 2 });
    } else if (selections.has("astro")) {
      structure.push({ name: "src", type: "folder", indent: 1 });
      structure.push({ name: "pages", type: "folder", indent: 2 });
      structure.push({ name: "index.astro", type: "file", indent: 3 });
      structure.push({ name: "components", type: "folder", indent: 2 });
      structure.push({ name: "layouts", type: "folder", indent: 2 });
    } else if (hasFrontend) {
      // React, Vue, Svelte, etc. with Vite
      structure.push({ name: "src", type: "folder", indent: 1 });
      structure.push({
        name: `index${getExt("tsx")}`,
        type: "file",
        indent: 2,
      });
      structure.push({ name: `App${getExt("tsx")}`, type: "file", indent: 2 });
      structure.push({ name: "components", type: "folder", indent: 2 });
      structure.push({ name: "lib", type: "folder", indent: 2 });
      structure.push({ name: `utils${getExt()}`, type: "file", indent: 3 });
    }

    // Backend-only structure (no frontend)
    if (isStandaloneBackend && !hasFrontend) {
      structure.push({ name: "src", type: "folder", indent: 1 });
      structure.push({ name: `index${getExt()}`, type: "file", indent: 2 });
      structure.push({ name: "routes", type: "folder", indent: 2 });
      structure.push({
        name: `index.route${getExt()}`,
        type: "file",
        indent: 3,
      });

      // Add controllers for Express/Fastify
      if (selections.has("express") || selections.has("fastify")) {
        structure.push({ name: "controllers", type: "folder", indent: 2 });
        structure.push({
          name: `index.controller${getExt()}`,
          type: "file",
          indent: 3,
        });
      }

      // Add models only for Mongoose (MongoDB)
      if (selections.has("mongoose")) {
        structure.push({ name: "models", type: "folder", indent: 2 });
        structure.push({
          name: `index.model${getExt()}`,
          type: "file",
          indent: 3,
        });
      }

      // Add middlewares
      structure.push({ name: "middlewares", type: "folder", indent: 2 });
      structure.push({ name: `index${getExt()}`, type: "file", indent: 3 });

      // Add lib/utils
      structure.push({ name: "lib", type: "folder", indent: 2 });
      structure.push({ name: `utils${getExt()}`, type: "file", indent: 3 });

      if (selections.has("trpc") || selections.has("orpc")) {
        structure.push({ name: "trpc", type: "folder", indent: 2 });
        structure.push({ name: `router${getExt()}`, type: "file", indent: 3 });
        structure.push({ name: `context${getExt()}`, type: "file", indent: 3 });
      }
    } else if (isStandaloneBackend && hasFrontend) {
      // Monorepo-style: server folder alongside frontend
      structure.push({ name: "server", type: "folder", indent: 1 });
      structure.push({ name: "src", type: "folder", indent: 2 });
      structure.push({ name: `index${getExt()}`, type: "file", indent: 3 });
      structure.push({ name: "routes", type: "folder", indent: 3 });
      structure.push({
        name: `index.route${getExt()}`,
        type: "file",
        indent: 4,
      });

      // Add controllers for Express/Fastify
      if (selections.has("express") || selections.has("fastify")) {
        structure.push({ name: "controllers", type: "folder", indent: 3 });
        structure.push({
          name: `index.controller${getExt()}`,
          type: "file",
          indent: 4,
        });
      }

      // Add models only for Mongoose (MongoDB)
      if (selections.has("mongoose")) {
        structure.push({ name: "models", type: "folder", indent: 3 });
        structure.push({
          name: `index.model${getExt()}`,
          type: "file",
          indent: 4,
        });
      }

      // Add middlewares
      structure.push({ name: "middlewares", type: "folder", indent: 3 });
      structure.push({ name: `index${getExt()}`, type: "file", indent: 4 });

      // Add lib/utils
      structure.push({ name: "lib", type: "folder", indent: 3 });
      structure.push({ name: `utils${getExt()}`, type: "file", indent: 4 });

      if (selections.has("trpc") || selections.has("orpc")) {
        structure.push({ name: "trpc", type: "folder", indent: 3 });
        structure.push({ name: `router${getExt()}`, type: "file", indent: 4 });
        structure.push({ name: `context${getExt()}`, type: "file", indent: 4 });
      }
    }

    // Database folder
    if (
      selections.has("drizzle") ||
      selections.has("prisma") ||
      selections.has("mongoose")
    ) {
      if (selections.has("drizzle")) {
        structure.push({ name: "db", type: "folder", indent: 1 });
        structure.push({ name: `schema${getExt()}`, type: "file", indent: 2 });
        structure.push({ name: `index${getExt()}`, type: "file", indent: 2 });
        structure.push({ name: "migrations", type: "folder", indent: 2 });
        structure.push({
          name: `drizzle.config${getExt()}`,
          type: "file",
          indent: 1,
        });
      } else if (selections.has("prisma")) {
        structure.push({ name: "prisma", type: "folder", indent: 1 });
        structure.push({ name: "schema.prisma", type: "file", indent: 2 });
        structure.push({ name: "migrations", type: "folder", indent: 2 });
      } else if (selections.has("mongoose")) {
        // Mongoose uses models folder structure added above
      }
    }

    // Config files
    structure.push({ name: "package.json", type: "file", indent: 1 });
    structure.push({ name: "tsconfig.json", type: "file", indent: 1 });

    if (selections.has("biome")) {
      structure.push({ name: "biome.json", type: "file", indent: 1 });
    }

    if (selections.has("eslint")) {
      structure.push({ name: "eslint.config.js", type: "file", indent: 1 });
    }

    if (selections.has("prettier")) {
      structure.push({ name: ".prettierrc", type: "file", indent: 1 });
    }

    if (selections.has("dotenv")) {
      structure.push({ name: ".env", type: "file", indent: 1 });
      structure.push({ name: ".env.example", type: "file", indent: 1 });
    }

    if (selections.has("git-init")) {
      structure.push({ name: ".gitignore", type: "file", indent: 1 });
    }

    return structure;
  };

  const structure = generateStructure();

  return (
    <div>
      <h2 className="text-foreground mb-4 font-mono text-sm font-medium">
        Recommended Structure
      </h2>
      <div className="border-border bg-card border p-4">
        <div className="space-y-1 font-mono text-sm">
          {structure.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center gap-2"
              style={{ paddingLeft: `${item.indent * 16}px` }}
            >
              {item.type === "folder" ? (
                <Folder className="size-4 text-blue-400" />
              ) : (
                <FileCode className="text-muted-foreground size-4" />
              )}
              <span
                className={cn(
                  item.type === "folder"
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShareDialog({ selections }: { selections: Set<string> }) {
  const [copied, setCopied] = useState(false);

  // Map category IDs to URL parameter names
  const categoryMap: Record<string, string> = {
    frontend: "fe",
    native: "na",
    backend: "be",
    api: "api",
    database: "db",
    orm: "orm",
    auth: "au",
    runtime: "rt",
    "db-setup": "dbs",
    payments: "pa",
    ui: "ui",
    validation: "va",
    addons: "add",
    git: "git",
    "package-manager": "pm",
    tooling: "tl",
  };

  // Get all technologies grouped by category
  const getTechsByCategory = () => {
    const techs: Record<string, string[]> = {};
    for (const category of categories) {
      techs[categoryMap[category.id] || category.id] = [];
      for (const tech of category.technologies) {
        if (selections.has(tech.id) && !tech.id.startsWith("no-")) {
          techs[categoryMap[category.id] || category.id].push(tech.id);
        }
      }
    }
    return techs;
  };

  // Generate share URL
  const generateShareUrl = () => {
    const techsByCategory = getTechsByCategory();
    const params = new URLSearchParams();

    // Add all selected technologies by category
    for (const [key, values] of Object.entries(techsByCategory)) {
      if (values.length > 0) {
        params.append(key, values.join(","));
      }
    }

    const baseUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/builder`
        : "http://localhost:3000/builder";

    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  const shareUrl = generateShareUrl();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSelectedTechs = () => {
    const selected: Technology[] = [];
    for (const category of categories) {
      for (const tech of category.technologies) {
        if (selections.has(tech.id) && !tech.id.startsWith("no-")) {
          selected.push(tech);
        }
      }
    }
    return selected;
  };

  const selectedTechs = getSelectedTechs();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 bg-transparent"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Stack</DialogTitle>
          <DialogDescription>
            Share this configuration with others
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="mb-3 text-sm font-medium">Selected Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTechs.length > 0 ? (
                selectedTechs.map((tech) => (
                  <Badge
                    key={tech.id}
                    variant="secondary"
                    className="gap-1.5 px-2 py-1"
                    style={{
                      borderColor: tech.color + "40",
                      backgroundColor: tech.color + "15",
                    }}
                  >
                    {tech.icon && (
                      <img
                        src={tech.icon}
                        alt={tech.name}
                        height={12}
                        width={12}
                      />
                    )}
                    <span className="text-xs">{tech.name}</span>
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-xs">
                  No technologies selected yet
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Share Link</label>
            <div className="flex gap-2">
              <Input type="text" value={shareUrl} readOnly />
              <Button onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BuilderPage() {
  const searchParams = useSearchParams()[0];
  const presetParam = searchParams.get("preset");

  const [projectName, setProjectName] = useState("my-app");
  const [selections, setSelections] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("configure");

  // Load preset or technologies from URL
  useEffect(() => {
    // First check if preset parameter exists
    if (presetParam) {
      const preset = presets.find(
        (p) =>
          p.id === presetParam ||
          p.name.toLowerCase().replace(" ", "-") === presetParam,
      );
      if (preset) {
        setSelections(new Set(preset.selections));
      }
      return;
    }

    // Otherwise, load technologies from URL parameters
    const newSelections = new Set<string>();
    const categoryMap: Record<string, string> = {
      fe: "frontend",
      na: "native",
      be: "backend",
      api: "api",
      db: "database",
      orm: "orm",
      au: "auth",
      rt: "runtime",
      dbs: "db-setup",
      pa: "payments",
      ui: "ui",
      va: "validation",
      add: "addons",
      git: "git",
      pm: "package-manager",
      tl: "tooling",
    };

    // Iterate through all possible URL parameters
    for (const [key] of Object.entries(categoryMap)) {
      const param = searchParams.get(key);
      if (param) {
        const techs = param.split(",");
        for (const tech of techs) {
          if (tech.trim()) {
            newSelections.add(tech.trim());
          }
        }
      }
    }

    if (newSelections.size > 0) {
      setSelections(newSelections);
    }
  }, [presetParam, searchParams]);

  const isIncompatible = useCallback(
    (tech: Technology): boolean => {
      if (!tech.incompatibleWith) return false;
      return tech.incompatibleWith.some((id) => selections.has(id));
    },
    [selections],
  );

  const handleSelect = useCallback(
    (tech: Technology, category: (typeof categories)[number]) => {
      if (isIncompatible(tech)) return;

      setSelections((prev) => {
        const newSet = new Set(prev);

        if (category.singleSelect) {
          // Remove other selections in this category
          for (const t of category.technologies) {
            newSet.delete(t.id);
          }
        }

        if (prev.has(tech.id)) {
          newSet.delete(tech.id);
        } else {
          newSet.add(tech.id);
        }

        return newSet;
      });
    },
    [isIncompatible],
  );

  const handleReset = () => {
    setSelections(new Set());
    setProjectName("my-app");
  };

  const handleRandom = () => {
    const newSelections = new Set<string>();

    for (const category of categories) {
      const validTechs = category.technologies.filter((t) => {
        if (t.id.startsWith("no-")) return false;
        if (!t.incompatibleWith) return true;
        return !t.incompatibleWith.some((id) => newSelections.has(id));
      });

      if (validTechs.length === 0) continue;

      if (category.singleSelect) {
        const randomTech =
          validTechs[Math.floor(Math.random() * validTechs.length)];
        newSelections.add(randomTech.id);
      } else {
        // Add 1-2 random items for multi-select categories
        const count = Math.min(
          Math.floor(Math.random() * 2) + 1,
          validTechs.length,
        );
        const shuffled = [...validTechs].sort(() => Math.random() - 0.5);
        for (let i = 0; i < count; i++) {
          newSelections.add(shuffled[i].id);
        }
      }
    }

    setSelections(newSelections);
  };

  const handlePreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setSelections(new Set(preset.selections));
    }
  };

  const getSelectedTechs = () => {
    const selected: Technology[] = [];
    for (const category of categories) {
      for (const tech of category.technologies) {
        if (selections.has(tech.id) && !tech.id.startsWith("no-")) {
          selected.push(tech);
        }
      }
    }
    return selected;
  };

  const generateCommand = () => {
    return generateSingleCommand(projectName, selections);
  };

  const allCommands = generateCommands(projectName, selections);

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCommand());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTechs = getSelectedTechs();

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col">
        <header className="border-border flex h-14 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden text-sm sm:inline">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <img
                className="dark:invert"
                src="Logo_dark.svg"
                alt="Logo"
                height={28}
                width={28}
              />
              <span className="font-semibold">StackForge</span>
              <Badge variant="outline" className="text-xs">
                Builder
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Tooltip disableHoverableContent>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleReset}>
                    <RotateCcw className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="pointer-events-none">
                  Reset all
                </TooltipContent>
              </Tooltip>
              <Tooltip disableHoverableContent>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleRandom}>
                    <Shuffle className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="pointer-events-none">
                  Random stack
                </TooltipContent>
              </Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1 bg-transparent">
                    Presets
                    <ChevronDown className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {presets.map((preset) => (
                    <DropdownMenuItem
                      key={preset.id}
                      onClick={() => handlePreset(preset.id)}
                      className="flex flex-col items-start gap-1"
                    >
                      <span className="font-medium">{preset.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {preset.description}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className="border-border bg-sidebar flex w-72 shrink-0 flex-col border-r">
            <div className="border-border border-b p-4">
              <label className="text-muted-foreground mb-2 block text-xs font-medium">
                Project Name
              </label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value || "")}
                placeholder="my-app"
                className="bg-background h-9 font-mono text-sm"
              />
            </div>
            <div className="border-border border-b p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium">
                  Command
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="text-foreground size-3" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </div>
              <div className="border-border bg-background border p-3">
                <code className="text-foreground block font-mono text-xs break-all">
                  <span className="text-muted-foreground">$ </span>
                  {generateCommand()}
                </code>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-medium">
                  Selected Stack
                </span>
                <Badge variant="secondary" className="text-xs">
                  {selectedTechs.length}
                </Badge>
              </div>
              <ScrollArea className="h-[calc(100%-28px)]">
                <div className="flex flex-wrap gap-1.5">
                  {selectedTechs.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No technologies selected
                    </p>
                  ) : (
                    selectedTechs.map((tech) => (
                      <Badge
                        key={tech.id}
                        variant="secondary"
                        className="gap-1.5 px-2 py-1"
                        style={{
                          borderColor: tech.color + "40",
                          backgroundColor: tech.color + "15",
                        }}
                      >
                        {tech.icon && (
                          <img
                            src={tech.icon}
                            alt={tech.name}
                            height={12}
                            width={12}
                          />
                        )}
                        <span className="text-xs">{tech.name}</span>
                      </Badge>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
            <div className="border-border border-t p-4">
              <div className="flex gap-2">
                <ShareDialog selections={selections} />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 bg-transparent"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            </div>
          </aside>
          <main className="flex-1 overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex h-full flex-col"
            >
              <div className="border-border flex h-12 shrink-0 items-center justify-center border-b">
                <TabsList className="bg-transparent">
                  <TabsTrigger
                    value="configure"
                    className="data-[state=active]:bg-secondary gap-2"
                  >
                    <Settings className="size-4" />
                    Configure
                  </TabsTrigger>
                  <TabsTrigger
                    value="commands"
                    className="data-[state=active]:bg-secondary gap-2"
                  >
                    <Terminal className="size-4" />
                    Commands
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="data-[state=active]:bg-secondary gap-2"
                  >
                    <Eye className="size-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="configure"
                className="mt-0 flex-1 overflow-hidden"
              >
                <ScrollArea className="h-full">
                  <div className="mx-auto max-w-5xl space-y-8 p-6">
                    {categories.map((category) => (
                      <CategorySection
                        key={category.id}
                        category={category}
                        selections={selections}
                        onSelect={handleSelect}
                        isIncompatible={isIncompatible}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent
                value="commands"
                className="mt-0 flex-1 overflow-hidden"
              >
                <ScrollArea className="h-full">
                  <div className="mx-auto max-w-3xl space-y-4 p-6">
                    <div className="mb-6">
                      <h2 className="text-foreground mb-2 font-mono text-sm font-medium">
                        Setup Commands
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Run these commands in order to set up your project
                      </p>
                    </div>
                    {allCommands.map((step, index) => (
                      <CommandStep
                        key={`${step.label}-${index}`}
                        step={step}
                        index={index}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent
                value="preview"
                className="mt-0 flex-1 overflow-hidden"
              >
                <ScrollArea className="h-full">
                  <div className="mx-auto max-w-3xl p-6">
                    <FolderStructure
                      projectName={projectName}
                      selections={selections}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
