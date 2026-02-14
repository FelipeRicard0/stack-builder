export type CommandStep = {
  label: string;
  command: string;
  description?: string;
};

export function validateSelections(selections: Set<string>): string[] {
  const warnings: string[] = [];

  if (selections.has("biome") && selections.has("eslint")) {
    warnings.push(
      "Biome e ESLint podem conflitar. Recomenda-se escolher apenas um.",
    );
  }

  const orms = ["drizzle", "prisma", "mongoose"];
  const selectedOrms = orms.filter((orm) => selections.has(orm));
  if (selectedOrms.length > 1) {
    warnings.push(
      `Múltiplos ORMs selecionados: ${selectedOrms.join(", ")}. Considere usar apenas um.`,
    );
  }

  if (selections.has("husky") && selections.has("lefthook")) {
    warnings.push(
      "Husky e Lefthook são ambos gerenciadores de Git hooks. Escolha apenas um.",
    );
  }

  if (selections.has("authjs") && !selections.has("nextjs")) {
    warnings.push(
      "Auth.js (next-auth) é projetado principalmente para Next.js.",
    );
  }

  const routers = ["tanstack", "react-router"];
  const selectedRouters = routers.filter((router) => selections.has(router));
  if (selectedRouters.length > 1) {
    warnings.push(
      `Múltiplos routers selecionados: ${selectedRouters.join(", ")}. Escolha apenas um.`,
    );
  }

  return warnings;
}

const FRAMEWORKS_WITH_TAILWIND = [
  "nextjs",
  "expo-uniwind",
  "shadcn",
  "tanstack",
  "react-router",
  "astro",
  "svelte",
  "solid",
  "nuxt",
];

function hasAnySelection(selections: Set<string>, options: string[]): boolean {
  return options.some((option) => selections.has(option));
}

export function generateCommands(
  projectName: string,
  selections: Set<string>,
): CommandStep[] {
  const steps: CommandStep[] = [];
  const pm = selections.has("bun-pm")
    ? "bun"
    : selections.has("pnpm")
      ? "pnpm"
      : selections.has("yarn")
        ? "yarn"
        : "npm";
  const pmx =
    pm === "npm"
      ? "npx"
      : pm === "pnpm"
        ? "pnpm exec"
        : pm === "yarn"
          ? "yarn dlx"
          : "bunx";
  const pmAdd =
    pm === "npm"
      ? "npm install"
      : pm === "pnpm"
        ? "pnpm add"
        : pm === "yarn"
          ? "yarn add"
          : "bun add";
  const pmAddDev =
    pm === "npm"
      ? "npm install -D"
      : pm === "pnpm"
        ? "pnpm add -D"
        : pm === "yarn"
          ? "yarn add -D"
          : "bun add -d";

  let needsSeparateCd = false;

  const usesTailwind =
    hasAnySelection(selections, FRAMEWORKS_WITH_TAILWIND) ||
    selections.has("tailwindcss");

  if (selections.has("nextjs")) {
    let nextCmd = `${pmx === "npx" ? "npx" : pm} create${pmx === "npx" ? "-" : " "}next-app@latest ${projectName}`;

    const flags: string[] = [];

    flags.push(selections.has("typescript") ? "--typescript" : "--js");
    flags.push(selections.has("tailwindcss") ? "--tailwind" : "--no-tailwind");
    flags.push(
      selections.has("eslint") || selections.has("biome")
        ? selections.has("eslint")
          ? "--eslint"
          : "--biome"
        : "--no-eslint",
    );

    nextCmd += " " + flags.join(" ");

    steps.push({
      label: "Create Next.js project",
      command: nextCmd,
      description: "Initialize a new Next.js project",
    });
    needsSeparateCd = true;
  } else if (selections.has("nuxt")) {
    steps.push({
      label: "Create Nuxt project",
      command: `${pmx} nuxi@latest init ${projectName}`,
      description: "Initialize a new Nuxt 3 project",
    });
    needsSeparateCd = true;
  } else if (selections.has("astro")) {
    steps.push({
      label: "Create Astro project",
      command: `${pm} create astro@latest ${projectName}`,
      description: "Initialize a new Astro project",
    });
    needsSeparateCd = true;
  } else if (selections.has("svelte")) {
    steps.push({
      label: "Create Svelte project",
      command: `${pmx} sv create ${projectName}`,
      description: "Initialize a new SvelteKit project",
    });
    needsSeparateCd = true;
  } else if (selections.has("solid")) {
    const solidTemplate = selections.has("typescript") ? "ts" : "js";
    const description = selections.has("typescript")
      ? "Initialize a new Solid project with TypeScript"
      : "Initialize a new Solid project";

    steps.push({
      label: "Create Solid project",
      command: `${pmx} degit solidjs/templates/${solidTemplate} ${projectName}`,
      description: description,
    });
    needsSeparateCd = true;
  } else if (selections.has("tanstack")) {
    let tanstackCmd = `npx @tanstack/cli@latest create ${projectName} --package-manager ${pm}`;

    const flags: string[] = [];

    if (selections.has("better-auth")) flags.push("better-auth");
    if (selections.has("clerk")) flags.push("clerk");
    if (selections.has("eslint")) flags.push("eslint");
    if (selections.has("biome")) flags.push("biome");
    if (selections.has("shadcn")) flags.push("shadcn");
    if (selections.has("neon")) flags.push("neon");
    if (selections.has("convex")) flags.push("convex");
    if (selections.has("prisma")) flags.push("prisma");
    if (selections.has("drizzle")) flags.push("drizzle");
    if (selections.has("orpc")) flags.push("orpc");
    if (selections.has("trpc")) flags.push("trpc");

    if (flags.length > 0) {
      tanstackCmd += ` --add-ons ${flags.join(",")}`;
    }
    // --no-git sempre
    if (!selections.has("git-init")) {
      tanstackCmd += " --no-git";
    }

    const description = selections.has("typescript")
      ? "Initialize a new React project with Vite and TypeScript"
      : "Initialize a new React project with Vite";

    steps.push({
      label: "Create React + Vite project with TanStack",
      command: tanstackCmd,
      description: description,
    });

    needsSeparateCd = true;
  } else if (selections.has("react-router")) {
    const viteTemplate = selections.has("typescript") ? "react-ts" : "react";
    const description = selections.has("typescript")
      ? "Initialize a new React project with Vite and TypeScript"
      : "Initialize a new React project with Vite";

    steps.push({
      label: "Create React + Vite project with React Router",
      command: `${pm} create ${pm === "npm" ? "vite@latest" : "vite"} ${projectName} ${pm === "npm" ? "--" : ""} --template ${viteTemplate}`,
      description: description,
    });
    needsSeparateCd = true;
  } else if (
    selections.has("expo-bare") ||
    selections.has("expo-uniwind") ||
    selections.has("expo-unistyles")
  ) {
    steps.push({
      label: "Create Expo project",
      command: `${pmx} create-expo-app@latest ${projectName} --template default`,
      description: "Initialize a new Expo project",
    });
    needsSeparateCd = true;
  } else if (selections.has("hono")) {
    steps.push({
      label: "Create Hono project",
      command: `${pm} create hono@latest ${projectName}`,
      description: "Initialize a new Hono project",
    });
    needsSeparateCd = true;
  } else if (selections.has("elysia")) {
    steps.push({
      label: "Create Elysia project",
      command: `bun create elysia ${projectName}`,
      description: "Initialize a new Elysia project (requires Bun)",
    });
    needsSeparateCd = true;
  } else if (selections.has("express") || selections.has("fastify")) {
    const initCmd =
      pm === "npm"
        ? `npm init -y`
        : pm === "pnpm"
          ? `pnpm init`
          : pm === "yarn"
            ? `yarn init -y`
            : `bun init`;
    const mkdirCmd = `mkdir ${projectName}\\src\\controllers && cd ${projectName}/src && mkdir routes middlewares lib ${selections.has("mongoose") ? "models" : ""}`;
    steps.push({
      label: "Initialize Node.js project",
      command: `${mkdirCmd} && cd .. && ${initCmd}`,
      description:
        "Create a new Node.js project directory with recommended structure and initialize package.json",
    });
    needsSeparateCd = false;
  } else {
    const initCmd =
      pm === "npm"
        ? `npm init -y`
        : pm === "pnpm"
          ? `pnpm init`
          : pm === "yarn"
            ? `yarn init -y`
            : `bun init`;
    steps.push({
      label: "Initialize project",
      command: `mkdir ${projectName} && cd ${projectName} && ${initCmd}`,
      description: "Create a new project directory and initialize package.json",
    });
    needsSeparateCd = false;
  }

  const isMonorepo =
    (selections.has("nextjs") ||
      selections.has("tanstack") ||
      selections.has("react-router")) &&
    (selections.has("express") ||
      selections.has("fastify") ||
      selections.has("hono") ||
      selections.has("elysia"));

  if (isMonorepo && needsSeparateCd) {
    const mongooseFolders = `cd ${projectName} && mkdir server\\src\\controllers && cd server/src && mkdir routes middlewares lib ${selections.has("mongoose") ? "models" : ""}`;
    steps.push({
      label: "Create server folder structure",
      command: `${mongooseFolders} && cd ../..`,
      description:
        "Create server folder with recommended structure for monorepo setup",
    });
  }

  if (!isMonorepo && needsSeparateCd) {
    steps.push({
      label: "Navigate to project",
      command: `cd ${projectName}`,
      description: "Change to project directory",
    });
  }

  const deps: string[] = [];
  const devDeps: string[] = [];

  if (selections.has("react-router")) {
    deps.push("react-router-dom");
  }

  if (selections.has("hono") && !steps[0].command.includes("hono")) {
    deps.push("hono");
  }

  if (selections.has("express")) {
    deps.push("express");
    if (selections.has("typescript")) {
      devDeps.push("@types/express");
    }
  }

  if (selections.has("fastify")) {
    deps.push("fastify");
  }

  // API layer
  if (selections.has("trpc") && !selections.has("tanstack")) {
    deps.push(
      "@trpc/server",
      "@trpc/client",
      "@trpc/react-query",
      "@tanstack/react-query",
    );
  }

  if (selections.has("orpc") && !selections.has("tanstack")) {
    deps.push(
      "@orpc/server",
      "@orpc/client",
      "@orpc/react-query",
      "@tanstack/react-query",
    );
  }

  if (selections.has("drizzle") && !selections.has("tanstack")) {
    deps.push("drizzle-orm");
    devDeps.push("drizzle-kit");

    if (selections.has("postgresql") || selections.has("neon")) {
      deps.push("@neondatabase/serverless");
    } else if (selections.has("sqlite") || selections.has("turso")) {
      deps.push("@libsql/client");
    } else if (selections.has("mysql") || selections.has("planetscale")) {
      deps.push("@planetscale/database");
    }
  }

  if (selections.has("prisma") && !selections.has("tanstack")) {
    deps.push("@prisma/client");
    devDeps.push("prisma");
  }

  if (selections.has("mongoose")) {
    deps.push("mongoose");
  }

  // Auth
  if (selections.has("better-auth") && !selections.has("tanstack")) {
    deps.push("better-auth");
  }

  if (selections.has("clerk")) {
    if (selections.has("nextjs")) {
      deps.push("@clerk/nextjs");
    } else if (selections.has("react-router")) {
      deps.push("@clerk/clerk-react");
    } else if (
      selections.has("expo-bare") ||
      selections.has("expo-uniwind") ||
      selections.has("expo-unistyles")
    ) {
      deps.push("@clerk/clerk-expo");
    }
  }

  if (selections.has("authjs")) {
    deps.push("next-auth");
  }

  if (selections.has("lucia")) {
    deps.push("lucia", "@lucia-auth/adapter-drizzle");
  }

  if (selections.has("shadcn") && !selections.has("tanstack")) {
    deps.push("class-variance-authority", "clsx", "tailwind-merge");
  }

  if (selections.has("heroui")) {
    deps.push("@heroui/react", "framer-motion");
  }

  if (selections.has("radix")) {
    deps.push("@radix-ui/themes");
  }

  if (selections.has("ark-ui")) {
    deps.push("@ark-ui/react");
  }

  if (selections.has("stripe")) {
    deps.push("stripe", "@stripe/stripe-js");
  }

  if (selections.has("polar")) {
    deps.push("@polar-sh/nextjs");
  }

  if (selections.has("zod")) {
    deps.push("zod");
  }

  if (selections.has("valibot")) {
    deps.push("valibot");
  }

  if (selections.has("typescript")) {
    const frameworkInstallsTS =
      (selections.has("nextjs") &&
        steps[0]?.command.includes("--typescript")) ||
      selections.has("nuxt") ||
      selections.has("astro") ||
      (selections.has("tanstack") && steps[0]?.command.includes("react-ts")) ||
      (selections.has("react-router") &&
        steps[0]?.command.includes("react-ts")) ||
      (selections.has("svelte") && steps[0]?.command.includes("sv create")) ||
      (selections.has("solid") && steps[0]?.command.includes("templates/ts"));

    if (!frameworkInstallsTS) {
      devDeps.push("typescript");
    }

    const frameworkInstallsTypesNode =
      (selections.has("nextjs") &&
        steps[0]?.command.includes("--typescript")) ||
      selections.has("nuxt") ||
      selections.has("astro") ||
      (selections.has("hono") && steps[0]?.command.includes("create hono")) ||
      (selections.has("elysia") && steps[0]?.command.includes("create elysia"));

    const isReactNative =
      selections.has("expo-bare") ||
      selections.has("expo-uniwind") ||
      selections.has("expo-unistyles");

    if (!isReactNative && !frameworkInstallsTypesNode) {
      devDeps.push("@types/node");
    }

    const needsRuntimeTS =
      selections.has("express") ||
      selections.has("fastify") ||
      selections.has("hono") ||
      selections.has("elysia");

    if (needsRuntimeTS) {
      devDeps.push("tsx", "tsc-alias");
    }
  }

  if (
    selections.has("tailwindcss") &&
    !selections.has("nextjs") &&
    !selections.has("tanstack")
  ) {
    devDeps.push("tailwindcss", "@tailwindcss/vite");
  }

  if (
    selections.has("biome") &&
    !selections.has("nextjs") &&
    !selections.has("tanstack")
  ) {
    devDeps.push("@biomejs/biome");
  }

  if (selections.has("eslint") && !steps[0].command.includes("--eslint")) {
    devDeps.push("eslint", "@eslint/js", "typescript-eslint");
  }

  if (selections.has("prettier")) {
    devDeps.push("prettier");
    if (usesTailwind || selections.has("tailwindcss")) {
      devDeps.push("prettier-plugin-tailwindcss");
    }
  }

  if (selections.has("husky")) {
    devDeps.push("husky", "lint-staged");
  }

  if (selections.has("lefthook")) {
    devDeps.push("lefthook");
  }

  // Addons
  if (selections.has("dotenv")) {
    deps.push("dotenv");
  }

  if (selections.has("ai-sdk")) {
    deps.push("ai", "@ai-sdk/openai");
  }

  // Expo-specific
  if (selections.has("expo-uniwind")) {
    deps.push("nativewind");
    devDeps.push("tailwindcss");
  }

  if (selections.has("expo-unistyles")) {
    deps.push("react-native-unistyles");
  }

  if (deps.length > 0) {
    steps.push({
      label: "Install dependencies",
      command: `${pmAdd} ${deps.join(" ")}`,
      description: "Install project dependencies",
    });
  }

  if (devDeps.length > 0) {
    steps.push({
      label: "Install dev dependencies",
      command: `${pmAddDev} ${devDeps.join(" ")}`,
      description:
        "Install additional development dependencies not included by the framework",
    });
  }

  if (selections.has("shadcn") && !selections.has("tanstack")) {
    steps.push({
      label: "Initialize shadcn/ui",
      command: `${pmx} shadcn@latest init`,
      description: "Set up shadcn/ui components",
    });
  }

  if (
    selections.has("typescript") &&
    (selections.has("express") ||
      selections.has("fastify") ||
      selections.has("hono") ||
      selections.has("elysia"))
  ) {
    steps.push({
      label: "Initialize TypeScript",
      command: `${pmx} tsc --init`,
      description: "Generate tsconfig.json",
    });
  }

  if (selections.has("prisma") && !selections.has("tanstack")) {
    steps.push({
      label: "Initialize Prisma",
      command: `${pmx} prisma init`,
      description: "Set up Prisma ORM",
    });
  }

  if (
    selections.has("biome") &&
    !selections.has("nextjs") &&
    !selections.has("tanstack")
  ) {
    steps.push({
      label: "Initialize Biome",
      command: `${pmx} ${pmx === "npx" ? "@biomejs/biome" : "biome"} init`,
      description: "Set up Biome configuration",
    });
  }

  if (selections.has("husky")) {
    steps.push({
      label: "Initialize Husky",
      command: `${pmx} husky init`,
      description: "Set up Git hooks with Husky",
    });
  }

  if (selections.has("lefthook")) {
    steps.push({
      label: "Initialize Lefthook",
      command: `${pmx} lefthook install`,
      description: "Set up Git hooks with Lefthook",
    });
  }

  if (selections.has("git-init") && !selections.has("tanstack")) {
    steps.push({
      label: "Initialize Git",
      command: "git init",
      description: "Initialize Git repository",
    });
  }

  return steps;
}

export function generateSingleCommand(
  projectName: string,
  selections: Set<string>,
): string {
  const pm = selections.has("bun-pm")
    ? "bun"
    : selections.has("pnpm")
      ? "pnpm"
      : selections.has("yarn")
        ? "yarn"
        : "npm";
  const pmx =
    pm === "npm"
      ? "npx"
      : pm === "pnpm"
        ? "pnpm exec"
        : pm === "yarn"
          ? "yarn dlx"
          : "bunx";

  if (selections.has("nextjs")) {
    const nextCmd = `${pmx === "npx" ? "npx" : pm} create${pmx === "npx" ? "-" : " "}next-app@latest ${projectName}`;

    const flags: string[] = [];

    flags.push(selections.has("typescript") ? "--typescript" : "--js");
    flags.push(selections.has("tailwindcss") ? "--tailwind" : "--no-tailwind");
    flags.push(
      selections.has("eslint") || selections.has("biome")
        ? selections.has("eslint")
          ? "--eslint"
          : "--biome"
        : "--no-eslint",
    );

    return nextCmd + " " + flags.join(" ");
  }

  if (selections.has("nuxt")) {
    return `${pmx} nuxi@latest init ${projectName}`;
  }

  if (selections.has("astro")) {
    return `${pm} create astro@latest ${projectName}`;
  }

  if (selections.has("svelte")) {
    return `${pmx} sv create ${projectName}`;
  }

  if (selections.has("solid")) {
    const solidTemplate = selections.has("typescript") ? "ts" : "js";
    return `${pmx} degit solidjs/templates/${solidTemplate} ${projectName}`;
  }

  if (selections.has("tanstack")) {
    let tanstackCmd = `npx @tanstack/cli@latest create ${projectName} --package-manager ${pm}`;

    const flags: string[] = [];

    if (selections.has("better-auth")) flags.push("better-auth");
    if (selections.has("clerk")) flags.push("clerk");
    if (selections.has("eslint")) flags.push("eslint");
    if (selections.has("biome")) flags.push("biome");
    if (selections.has("shadcn")) flags.push("shadcn");
    if (selections.has("neon")) flags.push("neon");
    if (selections.has("convex")) flags.push("convex");
    if (selections.has("prisma")) flags.push("prisma");
    if (selections.has("drizzle")) flags.push("drizzle");
    if (selections.has("orpc")) flags.push("orpc");
    if (selections.has("trpc")) flags.push("trpc");

    if (flags.length > 0) {
      tanstackCmd += ` --add-ons ${flags.join(",")}`;
    }
    // --no-git sempre
    if (!selections.has("git-init")) {
      tanstackCmd += " --no-git";
    }

    return tanstackCmd;
  }

  if (selections.has("react-router")) {
    const viteTemplate = selections.has("typescript") ? "react-ts" : "react";
    return `${pm} create vite@latest ${projectName} -- --template ${viteTemplate}`;
  }

  if (
    selections.has("expo-bare") ||
    selections.has("expo-uniwind") ||
    selections.has("expo-unistyles")
  ) {
    return `${pmx} create-expo-app@latest ${projectName} --template default`;
  }

  if (selections.has("hono")) {
    return `${pm} create hono@latest ${projectName}`;
  }

  if (selections.has("elysia")) {
    return `bun create elysia ${projectName}`;
  }

  return `mkdir ${projectName} && cd ${projectName} && ${pm} init -y`;
}
