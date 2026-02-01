import { createMarkdownProcessor } from "@astrojs/markdown-remark";

let processorPromise = null;

export async function renderMarkdown(markdown) {
  if (!processorPromise) {
    processorPromise = createMarkdownProcessor();
  }

  const processor = await processorPromise;
  const { code } = await processor.render(markdown ?? "");
  return code;
}
