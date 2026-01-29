export type CommandStep = {
  label: string;
  command: string;
  description?: string;
};

/**
 * Valida seleções para detectar dependências conflitantes ou redundantes.
 *
 * @param selections - Set de strings representando as tecnologias selecionadas
 * @returns Array de strings contendo avisos sobre conflitos ou incompatibilidades
 *
 * @example
 * ```ts
 * const warnings = validateSelections(new Set(["biome", "eslint"]));
 * // Retorna: ["Biome e ESLint podem conflitar. Recomenda-se escolher apenas um."]
 * ```
 */
export function validateSelections(selections: Set<string>): string[] {
  const warnings: string[] = [];

  // Verificar linters conflitantes
  if (selections.has("biome") && selections.has("eslint")) {
    warnings.push(
      "Biome e ESLint podem conflitar. Recomenda-se escolher apenas um.",
    );
  }

  // Verificar múltiplos ORMs
  const orms = ["drizzle", "prisma", "mongoose"];
  const selectedOrms = orms.filter((orm) => selections.has(orm));
  if (selectedOrms.length > 1) {
    warnings.push(
      `Múltiplos ORMs selecionados: ${selectedOrms.join(", ")}. Considere usar apenas um.`,
    );
  }

  // Verificar múltiplos gerenciadores de Git hooks
  if (selections.has("husky") && selections.has("lefthook")) {
    warnings.push(
      "Husky e Lefthook são ambos gerenciadores de Git hooks. Escolha apenas um.",
    );
  }

  // Verificar Auth.js sem Next.js
  if (selections.has("authjs") && !selections.has("nextjs")) {
    warnings.push(
      "Auth.js (next-auth) é projetado principalmente para Next.js.",
    );
  }

  // Verificar múltiplos routers
  const routers = ["tanstack-router", "react-router"];
  const selectedRouters = routers.filter((router) => selections.has(router));
  if (selectedRouters.length > 1) {
    warnings.push(
      `Múltiplos routers selecionados: ${selectedRouters.join(", ")}. Escolha apenas um.`,
    );
  }

  // Verificar TanStack Router sem framework adequado
  if (
    selections.has("tanstack-router") &&
    !selections.has("tanstack-start") &&
    !selections.has("nextjs") &&
    !selections.has("react-router")
  ) {
    // TanStack Router é para React, então está ok se houver React base
    // Este aviso só será mostrado se nenhum framework React estiver selecionado
  }

  return warnings;
}

/**
 * Constantes para agrupamentos de frameworks e tecnologias.
 */
const FRAMEWORKS_WITH_TAILWIND = [
  "nextjs",
  "expo-uniwind",
  "shadcn",
  "tanstack-router",
  "tanstack-start",
  "react-router",
  "astro",
  "svelte",
  "solid",
  "nuxt",
];

// Constantes documentadas para referência futura
// const NODE_FRAMEWORKS = ["express", "fastify", "hono", "elysia"];
// const EXPO_FRAMEWORKS = ["expo-bare", "expo-uniwind", "expo-unistyles"];
// const FRONTEND_FRAMEWORKS = [
//   "nextjs",
//   "tanstack-router",
//   "react-router",
//   "tanstack-start",
//   "nuxt",
//   "astro",
//   "svelte",
//   "solid",
// ];

/**
 * Verifica se o set de seleções contém qualquer uma das opções fornecidas.
 *
 * @param selections - Set de strings representando as seleções
 * @param options - Array de strings para verificar
 * @returns true se qualquer opção estiver em selections
 */
function hasAnySelection(selections: Set<string>, options: string[]): boolean {
  return options.some((option) => selections.has(option));
}

/**
 * Gera uma lista de passos de comando para configurar um projeto baseado nas seleções do usuário.
 *
 * @param projectName - Nome do projeto a ser criado
 * @param selections - Set de strings representando as tecnologias selecionadas
 * @returns Array de objetos CommandStep contendo label, command e description
 *
 * @example
 * ```ts
 * const steps = generateCommands("my-app", new Set(["nextjs", "typescript", "tailwindcss"]));
 * // Retorna comandos para criar um projeto Next.js com TypeScript e Tailwind
 * ```
 */
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

  // Track if initialization includes cd (for manual mkdir cases)
  let needsSeparateCd = false;

  // Helper to check if using Tailwind (for prettier-plugin-tailwindcss)
  const usesTailwind =
    hasAnySelection(selections, FRAMEWORKS_WITH_TAILWIND) ||
    selections.has("tailwindcss");

  // 1. Project initialization
  if (selections.has("nextjs")) {
    // Build Next.js command with only selected options
    let nextCmd = `${pmx === "npx" ? "npx" : pm} create${pmx === "npx" ? "-" : " "}next-app@latest ${projectName}`;

    // Add conditional flags based on user selections
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
    // Usar template ts se TypeScript selecionado, caso contrário js
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
  } else if (selections.has("tanstack-start")) {
    steps.push({
      label: "Create TanStack Start project",
      command: `${pmx} create-tanstack-app@latest ${projectName}`,
      description: "Initialize a new TanStack Start project",
    });
    needsSeparateCd = true;
  } else if (selections.has("tanstack-router")) {
    // Usar template react-ts se TypeScript selecionado, caso contrário react
    const viteTemplate = selections.has("typescript") ? "react-ts" : "react";
    const description = selections.has("typescript")
      ? "Initialize a new React project with Vite and TypeScript"
      : "Initialize a new React project with Vite";

    steps.push({
      label: "Create React + Vite project with TanStack Router",
      command: `${pm} create vite@latest ${projectName} -- --template ${viteTemplate}`,
      description: description,
    });
    needsSeparateCd = true;
  } else if (selections.has("react-router")) {
    // Usar template react-ts se TypeScript selecionado, caso contrário react
    const viteTemplate = selections.has("typescript") ? "react-ts" : "react";
    const description = selections.has("typescript")
      ? "Initialize a new React project with Vite and TypeScript"
      : "Initialize a new React project with Vite";

    steps.push({
      label: "Create React + Vite project with React Router",
      command: `${pm} create vite@latest ${projectName} -- --template ${viteTemplate}`,
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
    // For Express/Fastify, combine mkdir + cd + init + folder structure into one step
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
    needsSeparateCd = false; // Already included cd
  } else {
    // Generic initialization - combine mkdir + cd + init
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
    needsSeparateCd = false; // Already included cd
  }

  // 2. Create server structure for monorepo (frontend + backend)
  const isMonorepo =
    (selections.has("nextjs") ||
      selections.has("tanstack-router") ||
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

  // 3. Navigate to project (only if not already included in init command)
  if (!isMonorepo && needsSeparateCd) {
    steps.push({
      label: "Navigate to project",
      command: `cd ${projectName}`,
      description: "Change to project directory",
    });
  }

  // 4. Additional dependencies based on selections
  const deps: string[] = [];
  const devDeps: string[] = [];

  // Router dependencies
  if (selections.has("tanstack-router") && !selections.has("tanstack-start")) {
    deps.push("@tanstack/react-router");
    devDeps.push("@tanstack/router-plugin");
  }

  if (selections.has("react-router")) {
    deps.push("react-router-dom");
  }

  // Backend framework (if not already included)
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
  if (selections.has("trpc")) {
    deps.push(
      "@trpc/server",
      "@trpc/client",
      "@trpc/react-query",
      "@tanstack/react-query",
    );
  }

  if (selections.has("orpc")) {
    deps.push(
      "@orpc/server",
      "@orpc/client",
      "@orpc/react-query",
      "@tanstack/react-query",
    );
  }

  // Database & ORM
  if (selections.has("drizzle")) {
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

  if (selections.has("prisma")) {
    deps.push("@prisma/client");
    devDeps.push("prisma");
  }

  if (selections.has("mongoose")) {
    deps.push("mongoose");
  }

  // Auth
  if (selections.has("better-auth")) {
    deps.push("better-auth");
  }

  if (selections.has("clerk")) {
    if (selections.has("nextjs")) {
      deps.push("@clerk/nextjs");
    } else if (
      selections.has("tanstack-router") ||
      selections.has("react-router")
    ) {
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
    // Use next-auth v5 (stable) - anteriormente era beta
    deps.push("next-auth");
  }

  if (selections.has("lucia")) {
    deps.push("lucia", "@lucia-auth/adapter-drizzle");
  }

  // UI Libraries
  if (selections.has("shadcn")) {
    // shadcn is installed via CLI, but we need the base deps
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

  // Payments
  if (selections.has("stripe")) {
    deps.push("stripe", "@stripe/stripe-js");
  }

  if (selections.has("polar")) {
    deps.push("@polar-sh/nextjs");
  }

  // Validation
  if (selections.has("zod")) {
    deps.push("zod");
  }

  if (selections.has("valibot")) {
    deps.push("valibot");
  }

  // TypeScript (Abordagem Minimalista)
  if (selections.has("typescript")) {
    // Lista de frameworks que JÁ instalam TypeScript via CLI
    const frameworkInstallsTS =
      (selections.has("nextjs") &&
        steps[0]?.command.includes("--typescript")) || // create-next-app --typescript
      selections.has("nuxt") || // nuxi init (sempre TS)
      selections.has("astro") || // create astro (inclui TS)
      selections.has("tanstack-start") || // create-tanstack-app (inclui TS)
      (selections.has("tanstack-router") &&
        steps[0]?.command.includes("react-ts")) || // vite react-ts
      (selections.has("react-router") &&
        steps[0]?.command.includes("react-ts")) || // vite react-ts
      (selections.has("svelte") && steps[0]?.command.includes("sv create")) || // sv create instala TS
      (selections.has("solid") && steps[0]?.command.includes("templates/ts")); // Solid ts template

    // Só instalar typescript se o framework NÃO instalou
    if (!frameworkInstallsTS) {
      devDeps.push("typescript");
    }

    // Lista de frameworks que JÃ instalam @types/node via CLI
    const frameworkInstallsTypesNode =
      (selections.has("nextjs") &&
        steps[0]?.command.includes("--typescript")) || // create-next-app --typescript
      selections.has("nuxt") || // nuxi init
      selections.has("astro") || // create astro
      selections.has("tanstack-start") || // create-tanstack-app
      (selections.has("hono") && steps[0]?.command.includes("create hono")) || // hono CLI
      (selections.has("elysia") && steps[0]?.command.includes("create elysia")); // elysia CLI

    // Projetos que NÃO precisam de @types/node (React Native)
    const isReactNative =
      selections.has("expo-bare") ||
      selections.has("expo-uniwind") ||
      selections.has("expo-unistyles");

    // Instalar @types/node apenas se: 1. Não é React Native 2. Framework não instalou
    if (!isReactNative && !frameworkInstallsTypesNode) {
      devDeps.push("@types/node");
    }

    // tsx e tsc-alias: APENAS para backends puros que precisam executar TS diretamente
    const needsRuntimeTS =
      selections.has("express") ||
      selections.has("fastify") ||
      selections.has("hono") ||
      selections.has("elysia");

    if (needsRuntimeTS) {
      devDeps.push("tsx", "tsc-alias");
    }
  }

  // Tailwind CSS (Abordagem Minimalista)
  if (selections.has("tailwindcss") && !selections.has("nextjs")) {
    devDeps.push("tailwindcss", "@tailwindcss/vite");
  }

  // Tooling
  if (selections.has("biome") && !selections.has("nextjs")) {
    devDeps.push("@biomejs/biome");
  }

  if (selections.has("eslint") && !steps[0].command.includes("--eslint")) {
    devDeps.push("eslint", "@eslint/js", "typescript-eslint");
  }

  if (selections.has("prettier")) {
    devDeps.push("prettier");
    // Only add tailwind plugin if using Tailwind CSS
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

  // Add dependency installation steps
  if (deps.length > 0) {
    steps.push({
      label: "Install dependencies",
      command: `${pmAdd} ${deps.join(" ")}`,
      description: "Install project dependencies",
    });
  }

  // Install dev dependencies (excluding packages already installed by framework CLIs)
  if (devDeps.length > 0) {
    steps.push({
      label: "Install dev dependencies",
      command: `${pmAddDev} ${devDeps.join(" ")}`,
      description:
        "Install additional development dependencies not included by the framework",
    });
  }

  // 4. Setup commands
  if (selections.has("shadcn")) {
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

  // Tailwind CSS is configured automatically - no initialization needed

  if (selections.has("prisma")) {
    steps.push({
      label: "Initialize Prisma",
      command: `${pmx} prisma init`,
      description: "Set up Prisma ORM",
    });
  }

  if (selections.has("biome") && !selections.has("nextjs")) {
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

  // 5. Git initialization
  if (selections.has("git-init")) {
    steps.push({
      label: "Initialize Git",
      command: "git init",
      description: "Initialize Git repository",
    });
  }

  return steps;
}

/**
 * Gera um único comando de inicialização de projeto.
 * Retorna apenas o comando primário para criar o projeto, sem etapas adicionais.
 *
 * @param projectName - Nome do projeto a ser criado
 * @param selections - Set de strings representando as tecnologias selecionadas
 * @returns String contendo o comando de inicialização do projeto
 *
 * @example
 * ```ts
 * const cmd = generateSingleCommand("my-app", new Set(["nextjs", "typescript"]));
 * // Retorna: "npx create-next-app@latest my-app --app --src-dir ..."
 * ```
 */
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

  // Return the primary creation command
  if (selections.has("nextjs")) {
    // Build Next.js command with only selected options
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

  if (selections.has("tanstack-start")) {
    return `${pmx} create-tanstack-app@latest ${projectName}`;
  }

  if (selections.has("tanstack-router")) {
    const viteTemplate = selections.has("typescript") ? "react-ts" : "react";
    return `${pm} create vite@latest ${projectName} -- --template ${viteTemplate}`;
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
