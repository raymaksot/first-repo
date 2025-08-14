import MiniSearch, { SearchOptions, SearchResult } from 'mini-search';

type QuranDoc = { id: string; surah: number; ayah: number; text: string; lang?: string };

type HadithDoc = { id: string; collection: string; number: string; text: string; lang?: string };

export class ClientSearch {
	private quranIndex: MiniSearch<QuranDoc>;
	private hadithIndex: MiniSearch<HadithDoc>;

	constructor() {
		this.quranIndex = new MiniSearch({
			fields: ['text'],
			storeFields: ['id', 'surah', 'ayah', 'text', 'lang'],
			searchOptions: { prefix: true, fuzzy: 0.1, boost: { text: 2 } },
		});
		this.hadithIndex = new MiniSearch({
			fields: ['text'],
			storeFields: ['id', 'collection', 'number', 'text', 'lang'],
			searchOptions: { prefix: true, fuzzy: 0.1, boost: { text: 2 } },
		});
	}

	indexQuran(docs: QuranDoc[]) {
		this.quranIndex.removeAll();
		this.quranIndex.addAll(docs);
	}

	indexHadith(docs: HadithDoc[]) {
		this.hadithIndex.removeAll();
		this.hadithIndex.addAll(docs);
	}

	searchQuran(query: string, opts?: { surah?: number; lang?: string }) {
		const results = this.quranIndex.search(query, { combineWith: 'AND' });
		return results.filter((r) => {
			const doc = r as unknown as SearchResult & QuranDoc;
			if (opts?.surah && doc.surah !== opts.surah) return false;
			if (opts?.lang && doc.lang !== opts.lang) return false;
			return true;
		});
	}

	searchHadith(query: string, opts?: { collection?: string; lang?: string }) {
		const results = this.hadithIndex.search(query, { combineWith: 'AND' });
		return results.filter((r) => {
			const doc = r as unknown as SearchResult & HadithDoc;
			if (opts?.collection && doc.collection !== opts.collection) return false;
			if (opts?.lang && doc.lang !== opts.lang) return false;
			return true;
		});
	}
}