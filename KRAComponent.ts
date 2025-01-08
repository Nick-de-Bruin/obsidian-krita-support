import KritaSupport from "main";
import { Component, TFile } from "obsidian";

export class KRAComponent extends Component {
	private contentEl: HTMLElement;
	private file: TFile;
	private objectURL?: string;
	private plugin: KritaSupport;

	public constructor(contentEl: HTMLElement, file: TFile, plugin: KritaSupport) {
		super();
		this.contentEl = contentEl;
		this.file = file;
		this.plugin = plugin;
	}

	async loadFile() {
		if (this.file) {
			this.objectURL = await this.plugin.getMergedFile(this.file);
			if (this.objectURL) {
				const image = new Image();
				image.src = this.objectURL;
				image.alt = this.file.name;

				this.contentEl.empty();
				this.contentEl.removeClass("image-loading");
				this.contentEl.addClasses(["media-embed", "image-embed"]);
				this.contentEl.append(image);	
			} else {
				this.contentEl.empty();
				this.contentEl.createEl('h1', { text: `Could not load ${this.file.path}` });
			}
		}
	}

	onload() {
		this.contentEl.addClass("image-loading");
		this.contentEl.createEl('i', { text: `Loading ${this.file.name}...`});
	}

    onunload() {
		if (this.objectURL) {
			URL.revokeObjectURL(this.objectURL);
		}

		this.objectURL = undefined;
	}
}
