<script lang="ts">
	import CodeMirror from "svelte-codemirror-editor";
	import { json } from "@codemirror/lang-json";
	import { indentOnInput } from "@codemirror/language";
	import { languageServerWithTransport } from "codemirror-languageserver";
	import JsonWorker from "./lib/_jsonWorker.ts?worker";
	import PostMessageWorkerTransport from "./lib/_transport";

	const yamlTransport = new PostMessageWorkerTransport(new JsonWorker()) as any;
</script>

<CodeMirror
	value={JSON.stringify(
		{
			compilerOptions: {
				baseUrl: ".",
				paths: {
					"$lib/*": ["./src/lib/*"],
				},
				allowJs: true,
				checkJs: true,
				esModuleInterop: true,
				forceConsistentCasingInFileNames: true,
				resolveJsonModule: true,
				skipLibCheck: true,
				sourceMap: true,
				strict: true,
				target: "es2019",
				moduleResolution: "node",
			},
		},
		null,
		2,
	)}
	useTab={false}
	extensions={[
		json(),
		indentOnInput(),
		languageServerWithTransport({
			transport: yamlTransport,
			rootUri: "file:///",
			workspaceFolders: null,
			documentUri: `file:///tsconfig.json`,
			languageId: "json",
		}),
	]}
/>
