<script setup lang="ts">
import {
  CheckCircle,
  CirclePlus,
  Code,
  Clipboard,
  Check,
  Eye,
  EyeOff,
  GitBranch,
  Globe,
  Package,
  RefreshCw,
  User,
} from "lucide-vue-next";
import { ref } from "vue";
import { exampleSchema } from "../utils/schemaExample.ts";
import JsonValidator from "../../src/components/features/JsonValidator.vue";
import SchemaInferencer from "../../src/components/features/SchemaInferencer.vue";
import JsonSchemaEditor from "../../src/components/SchemaEditor/JsonSchemaEditor.vue";
import Button from "../../src/components/ui/Button.vue";
import Select from "../../src/components/ui/Select.vue";
import { en } from "../../src/i18n/locales/en.ts";
import { provideTranslation } from "../../src/i18n/translation-context.ts";
import type { Translation } from "../../src/i18n/translation-keys.ts";
import type { JSONSchema } from "../../src/types/jsonSchema.ts";

const schema = ref<JSONSchema>(exampleSchema);
const readOnly = ref(false);
const inferDialogOpen = ref(false);
const validateDialogOpen = ref(false);
const language = ref("en");
const translation = ref<Translation>(en);

provideTranslation(translation.value);

const handleReset = () => (schema.value = exampleSchema);
const handleReadOnlyToggle = () => (readOnly.value = !readOnly.value);
const handleClear = () =>
  (schema.value = { type: "object", properties: {}, required: [] });

const languageOptions = [
  { label: "English", value: "en" },
  { label: "German", value: "de" },
  { label: "French", value: "fr" },
  { label: "Russian", value: "ru" },
  { label: "Ukrainian", value: "uk" },
  { label: "Spanish", value: "es" },
  { label: "Chinese", value: "zh" },
  { label: "Polish", value: "pl" },
];

const handleLanguageChange = (value: string) => {
  language.value = value;
  import(`../../src/i18n/locales/${value}.ts`).then((module) => {
    translation.value = module[value];
  });
};

const authorLinks = [
  { href: "https://github.com/gcasotti", text: "@gcasotti", icon: User },
  { href: "https://github.com/gcasotti/jsonjoy-builder-vue", text: "GitHub", icon: GitBranch, target: "_blank", rel: "nofollow noopener noreferrer" },
  { href: "https://www.npmjs.com/package/jsonjoy-builder-vue", text: "NPM", icon: Package, target: "_blank", rel: "nofollow noopener noreferrer" },
];

// Code snippets to show alongside the demo
const codeSnippets = [
  {
    label: "Basic",
    code: `<JsonSchemaEditor v-model:schema="schema" />`,
  },
  {
    label: "Read-only",
    code: `<JsonSchemaEditor v-model:schema="schema" :read-only="true" />`,
  },
  {
    label: "i18n",
    code: `import { provideTranslation } from 'jsonjoy-builder-vue'
import { de } from 'jsonjoy-builder-vue/i18n'

provideTranslation(de)`,
  },
];

const activeSnippet = ref(0);
const copied = ref(false);

const copySnippet = () => {
  navigator.clipboard.writeText(codeSnippets[activeSnippet.value].code);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 1500);
};
</script>

<template>
  <div class="min-h-screen bg-background jsonjoy">
    <!-- Top bar -->
    <header class="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div class="container mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-lg font-semibold tracking-tight">jsonjoy-builder-vue</span>
        </div>
        <div class="flex items-center gap-1">
          <template v-for="(link, index) in authorLinks" :key="link.href">
            <a
              :href="link.href"
              class="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 px-1.5 py-1"
              :target="link.target"
              :rel="link.rel"
            >
              <component :is="link.icon" :size="13" />
              <span class="hidden md:inline">{{ link.text }}</span>
            </a>
            <span v-if="index < authorLinks.length - 1" class="text-border">·</span>
          </template>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-2 sm:px-4 lg:px-8 py-6 space-y-6">
      <!-- Code snippet showcase -->
      <div class="rounded-lg border border-border/60 bg-muted/30 overflow-hidden">
        <div class="flex items-center justify-between border-b border-border/40 px-1">
          <div class="flex">
            <button
              v-for="(snippet, i) in codeSnippets"
              :key="snippet.label"
              type="button"
              @click="activeSnippet = i"
              :class="[
                'px-4 py-2 text-xs font-medium transition-colors relative',
                activeSnippet === i
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground/70'
              ]"
            >
              {{ snippet.label }}
              <span
                v-if="activeSnippet === i"
                class="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
              />
            </button>
          </div>
          <button
            type="button"
            @click="copySnippet"
            class="mr-2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Copy"
          >
            <Check v-if="copied" :size="14" class="text-green-500" />
            <Clipboard v-else :size="14" />
          </button>
        </div>
        <pre class="px-4 py-3 text-sm font-mono overflow-x-auto leading-relaxed"><code>{{ codeSnippets[activeSnippet].code }}</code></pre>
      </div>

      <!-- Toolbar -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" @click="handleReset">
            <RefreshCw :size="14" class="mr-1.5" /> Reset
          </Button>
          <Button variant="outline" size="sm" @click="handleClear">
            <CirclePlus :size="14" class="mr-1.5" /> Empty
          </Button>
          <Button variant="outline" size="sm" @click="inferDialogOpen = true">
            <Code :size="14" class="mr-1.5" /> Infer
          </Button>
          <Button variant="outline" size="sm" @click="validateDialogOpen = true">
            <CheckCircle :size="14" class="mr-1.5" /> Validate
          </Button>
          <Button variant="outline" size="sm" @click="handleReadOnlyToggle">
            <EyeOff v-if="!readOnly" :size="14" class="mr-1.5" />
            <Eye v-else :size="14" class="mr-1.5" />
            {{ readOnly ? 'Edit' : 'Read-only' }}
          </Button>
        </div>
        <div class="ml-auto flex items-center gap-2">
          <Globe :size="14" class="text-muted-foreground" />
          <Select
            :model-value="language"
            @update:model-value="handleLanguageChange"
            :options="languageOptions"
            placeholder="Language"
            class="h-8 text-xs font-medium w-28"
          />
        </div>
      </div>

      <!-- Editor -->
      <JsonSchemaEditor
        :schema="schema"
        :read-only="readOnly"
        @update:schema="schema = $event"
        class="shadow-sm border border-border/50 rounded-lg"
      />

      <!-- Dialogs -->
      <SchemaInferencer
        :visible="inferDialogOpen"
        @update:visible="inferDialogOpen = $event"
        @schema-inferred="schema = $event"
      />
      <JsonValidator
        :visible="validateDialogOpen"
        @update:visible="validateDialogOpen = $event"
        :schema="schema"
      />
    </main>
  </div>
</template>
