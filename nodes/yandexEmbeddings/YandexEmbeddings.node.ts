import {
	INodeType,
	INodeTypeDescription,
	ISupplyDataFunctions,
	NodeConnectionType,
	SupplyData,
} from 'n8n-workflow';
import { YandexGPTEmbeddings } from '@langchain/yandex';

export class YandexEmbeddings implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Yandex Embeddings',
		name: 'yandexEmbeddings',
		icon: 'file:yandex.svg',
		group: ['transform'],
		version: 1,
		description: 'Generate embeddings using Yandex Embeddings API',
		defaults: {
			name: 'Yandex Embeddings',
		},
		credentials: [
			{
				name: 'yandexKeyApi',
				required: true,
			},
		],
		inputs: [],
		outputs: [NodeConnectionType.AiEmbedding],
		outputNames: ['Embeddings'],
		properties: [
			{
				displayName: 'Model Name',
				name: 'model',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
				options: [
					{
						name: 'text-search-doc',
						value: 'text-search-doc',
					},
					{
						name: 'text-search-query',
						value: 'text-search-query',
					},
				],
				required: true,
				default: 'text-search-doc',
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const model = this.getNodeParameter('model', itemIndex) as string;
		const credentials = await this.getCredentials('yandexKeyApi');

		const embeddings = new YandexGPTEmbeddings({
			modelURI: `emb://${credentials.folderId}/${model}/latest`,
			apiKey: credentials.apiKey as string,
		});

		return {
			response: embeddings,
		};
	}
}
