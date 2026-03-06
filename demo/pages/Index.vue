<script setup lang="ts">
import {
  Clipboard,
  Check,
  GitBranch,
  Globe,
  Package,
  User,
} from "lucide-vue-next";
import { ref, computed, provide } from "vue";
import { exampleSchema } from "../utils/schemaExample.ts";
import JsonValidator from "../../src/components/features/JsonValidator.vue";
import SchemaInferencer from "../../src/components/features/SchemaInferencer.vue";
import JsonSchemaEditor from "../../src/components/SchemaEditor/JsonSchemaEditor.vue";
import Select from "../../src/components/ui/Select.vue";
import { en } from "../../src/i18n/locales/en.ts";
import { provideTranslation } from "../../src/i18n/translation-context.ts";
import type { Translation } from "../../src/i18n/translation-keys.ts";
import type { JSONSchema } from "../../src/types/jsonSchema.ts";

// ── State ──
const schema = ref<JSONSchema>(exampleSchema);
const inferSchema = ref<JSONSchema>({ type: "object", properties: {}, required: [] });
const language = ref("en");
const translation = ref<Translation>(en);
provideTranslation(translation.value);

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

// ── Demos ──
const demos = [
  {
    id: "editor",
    label: "Schema Editor",
    desc: "Full editor with visual builder and live JSON preview, side by side.",
    code: `<script setup>
import { ref } from 'vue'
import { JsonSchemaEditor } from 'jsonjoy-builder-vue'

const schema = ref({ type: 'object', properties: {} })
<\/script>

<template>
  <JsonSchemaEditor v-model:schema="schema" />
</template>`,
  },
  {
    id: "readonly",
    label: "Read-Only",
    desc: "Display an existing schema without allowing modifications.",
    code: `<JsonSchemaEditor
  :schema="schema"
  :read-only="true"
/>`,
  },
  {
    id: "infer",
    label: "Infer from JSON",
    desc: "Paste any JSON and automatically generate the matching schema.",
    code: `<script setup>
import { ref } from 'vue'
import { SchemaInferencer } from 'jsonjoy-builder-vue'

const show = ref(false)
const schema = ref({})
<\/script>

<template>
  <button @click="show = true">Infer</button>
  <SchemaInferencer
    v-model:visible="show"
    @schema-inferred="schema = $event"
  />
</template>`,
  },
  {
    id: "validate",
    label: "Validate JSON",
    desc: "Validate a JSON document against the current schema.",
    code: `<script setup>
import { ref } from 'vue'
import { JsonValidator } from 'jsonjoy-builder-vue'

const show = ref(false)
<\/script>

<template>
  <button @click="show = true">Validate</button>
  <JsonValidator
    v-model:visible="show"
    :schema="schema"
  />
</template>`,
  },
  {
    id: "i18n",
    label: "i18n",
    desc: "Switch languages at runtime. 8 locales included.",
    code: `<script setup>
import { provideTranslation } from 'jsonjoy-builder-vue'
import { de } from 'jsonjoy-builder-vue/i18n/locales/de'

provideTranslation(de)
<\/script>

<template>
  <JsonSchemaEditor v-model:schema="schema" />
</template>`,
  },
];

const activeDemo = ref("editor");
const activeSnippet = computed(() => demos.find(d => d.id === activeDemo.value)!);

const copied = ref(false);
const copySnippet = () => {
  navigator.clipboard.writeText(activeSnippet.value.code);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 1500);
};

// Infer dialog state
const inferDialogOpen = ref(false);
const validateDialogOpen = ref(false);

const authorLinks = [
  { href: "https://github.com/gcasotti", text: "@gcasotti", icon: User },
  { href: "https://github.com/gcasotti/jsonjoy-builder-vue", text: "GitHub", icon: GitBranch, target: "_blank", rel: "nofollow noopener noreferrer" },
  { href: "https://www.npmjs.com/package/jsonjoy-builder-vue", text: "NPM", icon: Package, target: "_blank", rel: "nofollow noopener noreferrer" },
];
</script>

<template>
  <div class="min-h-screen bg-background jsonjoy">
    <!-- Top bar -->
    <header class="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div class="container mx-auto px-4 lg:px-8 h-14 flex items-center justify-between">
        <span class="text-lg font-semibold tracking-tight">jsonjoy-builder-vue</span>
        <div class="flex items-center gap-1">
          <template v-for="(link, index) in authorLinks" :key="link.href">
            <a
              :href="link.href"
              class="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 px-1.5 py-1"
              :target="link.target" :rel="link.rel"
            >
              <component :is="link.icon" :size="13" />
              <span class="hidden md:inline">{{ link.text }}</span>
            </a>
            <span v-if="index < authorLinks.length - 1" class="text-border">·</span>
          </template>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-2 sm:px-4 lg:px-8 py-6">
      <!-- Demo tabs -->
      <div class="flex items-end gap-0 border-b border-border/50 mb-0 overflow-x-auto">
        <button
          v-for="demo in demos"
          :key="demo.id"
          type="button"
          @click="activeDemo = demo.id"
          :class="[
            'px-4 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap',
            activeDemo === demo.id
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground/70'
          ]"
        >
          {{ demo.label }}
          <span
            v-if="activeDemo === demo.id"
            class="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
          />
        </button>

        <!-- Language selector on the right -->
        <div class="ml-auto flex items-center gap-2 pb-1.5 pl-4 shrink-0">
          <Globe :size="14" class="text-muted-foreground" />
          <Select
            :model-value="language"
            @update:model-value="handleLanguageChange"
            :options="languageOptions"
            placeholder="Lang"
            class="h-8 text-xs font-medium w-28"
          />
        </div>
      </div>

      <!-- Active demo content -->
      <div class="grid lg:grid-cols-[1fr,340px] gap-0 border border-t-0 border-border/50 rounded-b-lg overflow-hidden min-h-[600px]">

        <!-- Live demo panel -->
        <div class="bg-background min-h-0 flex flex-col">
          <!-- Description bar -->
          <div class="px-4 py-2.5 border-b border-border/30 bg-muted/20 shrink-0">
            <p class="text-sm text-muted-foreground">{{ activeSnippet.desc }}</p>
          </div>

          <!-- Demo: Editor (full) -->
          <div v-if="activeDemo === 'editor'" class="grow min-h-0">
            <JsonSchemaEditor
              :schema="schema"
              @update:schema="schema = $event"
              class="h-full"
            />
          </div>

          <!-- Demo: Read-only -->
          <div v-else-if="activeDemo === 'readonly'" class="grow min-h-0">
            <JsonSchemaEditor
              :schema="schema"
              :read-only="true"
              class="h-full"
            />
          </div>

          <!-- Demo: Infer -->
          <div v-else-if="activeDemo === 'infer'" class="grow min-h-0 flex flex-col">
            <div class="p-4 shrink-0">
              <button
                type="button"
                @click="inferDialogOpen = true"
                class="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Open Inferencer
              </button>
            </div>
            <div class="grow min-h-0">
              <JsonSchemaEditor
                :schema="inferSchema"
                @update:schema="inferSchema = $event"
                class="h-full"
              />
            </div>
            <SchemaInferencer
              :visible="inferDialogOpen"
              @update:visible="inferDialogOpen = $event"
              @schema-inferred="inferSchema = $event"
            />
          </div>

          <!-- Demo: Validate -->
          <div v-else-if="activeDemo === 'validate'" class="grow min-h-0 flex flex-col">
            <div class="p-4 shrink-0">
              <button
                type="button"
                @click="validateDialogOpen = true"
                class="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Open Validator
              </button>
            </div>
            <div class="grow min-h-0">
              <JsonSchemaEditor
                :schema="schema"
                :read-only="true"
                class="h-full"
              />
            </div>
            <JsonValidator
              :visible="validateDialogOpen"
              @update:visible="validateDialogOpen = $event"
              :schema="schema"
            />
          </div>

          <!-- Demo: i18n -->
          <div v-else-if="activeDemo === 'i18n'" class="grow min-h-0">
            <JsonSchemaEditor
              :schema="schema"
              @update:schema="schema = $event"
              class="h-full"
            />
          </div>
        </div>

        <!-- Code panel -->
        <div class="border-t lg:border-t-0 lg:border-l border-border/50 bg-muted/30 flex flex-col min-h-0">
          <div class="flex items-center justify-between px-3 py-2 border-b border-border/30 shrink-0">
            <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Code</span>
            <button
              type="button"
              @click="copySnippet"
              class="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Copy"
            >
              <Check v-if="copied" :size="13" class="text-green-500" />
              <Clipboard v-else :size="13" />
            </button>
          </div>
          <pre class="px-4 py-3 text-[13px] font-mono leading-relaxed overflow-auto grow"><code>{{ activeSnippet.code }}</code></pre>
        </div>
      </div>
    </main>
  </div>
</template>
