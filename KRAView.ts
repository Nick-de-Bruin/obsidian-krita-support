import KritaSupport from "main";
import { FileView, WorkspaceLeaf } from "obsidian";

export const VIEW_TYPE_KRA = "krita-kra-view";

export class KRAView extends FileView {
	private objectURL?: string;
	private plugin: KritaSupport;
	allowNoFile = false;

	public constructor(leaf: WorkspaceLeaf, plugin: KritaSupport) {
		super(leaf);
		this.plugin = plugin;
	}

	public getViewType() {
		return VIEW_TYPE_KRA;
	}

	public getDisplayText(): string {
		return this.file ? this.file.basename : "Loading...";
	}

	public getIcon() {
		return "image";
	}

	public async onLoadFile(file: unknown): Promise<void> {
		if (this.file) {
			this.objectURL = await this.plugin.getMergedFile(this.file);
			if (this.objectURL) {
				const image = new Image();
				image.src = this.objectURL;
				image.alt = this.file.name;

				this.contentEl.empty();
				this.contentEl.append(image);	
			} else {
				this.contentEl.empty();
				this.contentEl.createEl('h1', { text: "Could not load image." });
			}
		}
	}

	public async onOpen() {
		this.contentEl.addClass("image-container");
		this.contentEl.createEl('h1', { text: "Loading image..."});
	}

	public async onClose() {
		if (this.objectURL) {
			URL.revokeObjectURL(this.objectURL);
		}

		this.objectURL = undefined;
	}
}
