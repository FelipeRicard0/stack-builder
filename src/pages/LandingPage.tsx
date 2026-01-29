import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Github,
  Heart,
  Layers,
  Sparkles,
  Terminal,
  Zap,
  Copy,
  Check,
  Twitter,
  Coffee,
} from "lucide-react";

const techLogos = [
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextjs" },
  { name: "Vue", icon: "vuejs" },
  { name: "Svelte", icon: "svelte" },
  { name: "Astro", icon: "astro" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Tailwind", icon: "tailwindcss" },
  { name: "PostgreSQL", icon: "postgresql" },
];

const features = [
  {
    icon: Layers,
    title: "Curated Stack Options",
    description:
      "Choose from battle-tested technologies across frontend, backend, database, and tooling categories.",
  },
  {
    icon: Zap,
    title: "Smart Compatibility",
    description:
      "Our intelligent system prevents incompatible selections and suggests optimal combinations.",
  },
  {
    icon: Terminal,
    title: "Instant Commands",
    description:
      "Get ready-to-run CLI commands tailored to your selections and preferred package manager.",
  },
  {
    icon: Sparkles,
    title: "Project Structure",
    description:
      "View the recommended folder structure based on your technology choices before you start.",
  },
];

const presets = [
  {
    id: "most-used",
    name: "Most Used Stack",
    techs: ["Next.js", "tRPC", "PostgreSQL", "Drizzle", "Better Auth"],
  },
  {
    id: "saas",
    name: "SaaS Starter",
    techs: ["Next.js", "tRPC", "PostgreSQL", "Prisma", "Clerk", "Stripe"],
  },
  {
    id: "fullstack-react",
    name: "Fullstack React",
    techs: [
      "TanStack Router",
      "Hono",
      "tRPC",
      "SQLite",
      "Drizzle",
      "Better Auth",
    ],
  },
];

function SupportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Heart />
          Support
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Support StackForge</DialogTitle>
          <DialogDescription>
            Help us keep this project free and open source. Your contribution
            makes a difference.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <a
            href="https://github.com/sponsors/FelipeRicard0"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-secondary/50 hover:bg-secondary flex items-center gap-4 border p-4 transition-colors"
          >
            <div className="flex size-10 items-center justify-center bg-pink-500/10 text-pink-500">
              <Heart className="size-5" />
            </div>
            <div>
              <div className="text-foreground font-medium">GitHub Sponsors</div>
              <div className="text-muted-foreground text-sm">
                Monthly or one-time support
              </div>
            </div>
          </a>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-border bg-secondary/50 hover:bg-secondary flex items-center gap-4 border p-4 transition-colors"
          >
            <div className="flex size-10 items-center justify-center bg-amber-500/10 text-amber-500">
              <Coffee className="size-5" />
            </div>
            <div>
              <div className="text-foreground font-medium">Buy Me a Coffee</div>
              <div className="text-muted-foreground text-sm">
                Quick one-time contribution
              </div>
            </div>
          </a>
          <div className="pt-2">
            <p className="text-muted-foreground text-center text-sm">
              Thank you for supporting open source!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LandingPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx create-stackforge@latest my-app");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <header className="border-border/50 bg-background/80 fixed top-0 z-10 w-screen border-b backdrop-blur-md">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <img
              className="size-8 dark:invert"
              src="Logo_dark.svg"
              alt="Logo"
            />
            <span className="text-lg font-semibold tracking-tight">
              StackForge
            </span>
          </div>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 md:flex">
            <Link
              to="#features"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Features
            </Link>
            <Link
              to="#presets"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Presets
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              GitHub
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <SupportDialog />
            <Link to="/builder">
              <Button size="sm" className="cursor-pointer">
                Start Building
                <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 size-150 -translate-x-1/2 rounded-full bg-sky-700/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="outline"
              className={
                "border-border/50 bg-secondary/50 text-muted-foreground mb-6 px-4 py-1.5"
              }
            >
              <Sparkles className="mr-2 size-3.5" />
              Build faster with the right stack
            </Badge>
            <h1
              className={
                "text-foreground text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
              }
            >
              Build Your Perfect
              <br />
              <span className="from-foreground via-foreground/80 to-muted-foreground bg-linear-to-r bg-clip-text text-transparent">
                Tech Stack
              </span>
            </h1>
            <p
              className={
                "text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty"
              }
            >
              Stop wasting time configuring projects from scratch. Select your
              technologies, get the perfect commands, and start building in
              seconds.
            </p>
            <div
              className={
                "mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              }
            >
              <Link to="/builder">
                <Button className="group" size={"lg"}>
                  Open Builder
                  <ArrowRight className="ml-0.5 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button
                onClick={handleCopy}
                size={"lg"}
                className="group border-border bg-secondary/50 hover:bg-secondary gap-3 border font-mono"
              >
                <span className="text-muted-foreground">$</span>
                <span className="text-foreground">
                  npx create-stackforge@latest my-app
                </span>
                {copied ? (
                  <Check className="text-foreground size-4" />
                ) : (
                  <Copy className="text-muted-foreground group-hover:text-foreground size-4 transition-colors" />
                )}
              </Button>
            </div>
          </div>
          <div className={"relative mt-20"}>
            <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-3">
              {techLogos.map((tech, index) => (
                <div
                  key={index}
                  className={
                    "border-border/50 bg-card hover:border-border hover:bg-secondary flex scale-100 cursor-default items-center gap-2 border px-4 py-2 text-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                  }
                >
                  <img
                    src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.icon}/${tech.icon}-original.svg`}
                    alt={tech.name}
                    className="size-4"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="text-card-foreground">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="border-border border-t py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-foreground text-3xl font-bold tracking-tight">
              Everything you need to start fast
            </h2>
            <p className="text-muted-foreground mt-4">
              A thoughtfully designed builder for modern web development.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group border-border bg-card hover:bg-secondary/50 cursor-default border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="bg-secondary text-foreground group-hover:bg-foreground group-hover:text-background mb-4 flex size-10 items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="text-card-foreground mb-2 font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="presets" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-foreground text-3xl font-bold tracking-tight">
              Start with a preset
            </h2>
            <p className="text-muted-foreground mt-4">
              Jump-start your project with community-favorite combinations.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {presets.map((preset) => (
              <Link
                key={preset.id}
                to={`/builder?preset=${preset.id}`}
                className="group border-border bg-card hover:border-foreground/20 hover:bg-secondary/50 border p-6 transition-all"
              >
                <h3 className="text-card-foreground mb-4 font-semibold">
                  {preset.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {preset.techs.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-secondary text-secondary-foreground"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="text-muted-foreground group-hover:text-foreground mt-4 flex items-center text-sm transition-colors">
                  Use this preset
                  <ArrowRight className="ml-2 h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-foreground text-3xl font-bold tracking-tight">
              Ready to build something great?
            </h2>
            <p className="text-muted-foreground mt-4">
              Join thousands of developers who use StackForge to start their
              projects faster.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/builder">
                <Button size="lg">
                  Launch Builder
                  <ArrowRight />
                </Button>
              </Link>
              <a
                href="https://github.com/FelipeRicard0/stack-builder"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  <Github />
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-border border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="bg-foreground text-background flex size-6 items-center justify-center">
                <Layers className="size-4" />
              </div>
              <span className="text-sm font-medium">StackForge</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Built with care for the developer community.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/FelipeRicard0/stack-builder"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="size-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
