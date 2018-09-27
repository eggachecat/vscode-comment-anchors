import { TreeDataProvider, Event, TreeItem } from "vscode";
import EntryAnchor from "./entryAnchor";
import EntryError from "./entryError";
import { AnchorEngine } from "./anchorEngine";
import EntryLoading from "./entryLoading";

/**
 * AnchorProvider implementation in charge of returning the anchors in the current file
 */
export class FileAnchorProvider implements TreeDataProvider<EntryAnchor|EntryError|EntryLoading> {

	readonly provider: AnchorEngine;
	readonly onDidChangeTreeData: Event<undefined>;

	constructor(provider: AnchorEngine) {
		this.onDidChangeTreeData = provider._onDidChangeTreeData.event;
		this.provider = provider;
	}

	getTreeItem(element: EntryAnchor|EntryError): TreeItem {
		return element;
	}

	getChildren(element?: EntryAnchor|EntryError): Thenable<EntryAnchor[]|EntryError[]|EntryLoading[]> {
		if(element) return Promise.resolve([]);

		// Return result
		return new Promise(resolve => {
			if(!this.provider.anchorsLoaded) {
				resolve([this.provider.statusLoading]);
			} else if(this.provider._editor == undefined) {
				resolve([this.provider.errorUnusableItem]);
			} else if(this.provider.currentAnchors.length == 0) {
				resolve([this.provider.errorEmptyItem]);
			} else {
				resolve(EntryAnchor.sortAnchors(this.provider.currentAnchors));
			}
		});
	}

}