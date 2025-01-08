import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js';
import { Plugin, TFile } from 'obsidian';
import { EmbedRegistry } from 'obsidian-typings';
import { KRAView, VIEW_TYPE_KRA } from 'KRAView';
import { KRAComponent } from 'KRAComponent';

export default class KritaSupport extends Plugin {
	async onload() {
		this.registerView(VIEW_TYPE_KRA, (leaf) => new KRAView(leaf, this));
		this.registerExtensions(["kra"], VIEW_TYPE_KRA);

		const embedRegistry = this.app.embedRegistry as EmbedRegistry
		embedRegistry.registerExtension("kra", (context, file, _) => {
			return new KRAComponent(context.containerEl, file, this);
		});
	}

	async onunload() {
		const embedRegistry = this.app.embedRegistry as EmbedRegistry
		embedRegistry.unregisterExtension("kra");
	}

	async getMergedFile(file: TFile): Promise<string | undefined> {
		return await this.getFileFromZip(file, "mergedimage.png");
	}

	async getPreviewFile(file: TFile): Promise<string | undefined> {
		return await this.getFileFromZip(file, "preview.png");
	}

	async getFileFromZip(file: TFile, path: string): Promise<string | undefined> {
		const KRA_resource = this.app.vault.getResourcePath(file);
		const response = await fetch(KRA_resource);
		const KRA_blob = await response.blob();

		// Get the image from the zip
		const reader = new ZipReader(new BlobReader(KRA_blob));
		const entries = await reader.getEntries();
		const target_entry = entries.find(entry => entry.filename === path);

		if (target_entry && target_entry.getData) {
			const image_file = await target_entry.getData(new BlobWriter());
			return URL.createObjectURL(image_file);
		}

		return undefined;
	}
}
