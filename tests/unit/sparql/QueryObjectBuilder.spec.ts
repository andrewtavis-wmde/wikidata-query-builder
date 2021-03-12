import allNamespaces from '@/sparql/rdfNamespaces';
import QueryObjectBuilder from '@/sparql/QueryObjectBuilder';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import ReferenceRelation from '@/data-model/ReferenceRelation';

describe( 'QueryObjectBuilder', () => {
	it( 'simple', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const expected = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
			],
			where: [
				{
					type: 'bgp',
					triples: [
						{
							subject: {
								termType: 'Variable',
								value: 'item',
							},
							predicate: { type: 'path',
								pathType: '/',
								items: [ {
									termType: 'NamedNode',
									value: 'http://www.wikidata.org/prop/P281',
								},
								{
									termType: 'NamedNode',
									value: 'http://www.wikidata.org/prop/statement/P281',
								},
								] },
							object: {
								termType: 'Literal',
								value: 'XXXX',
							},
						},
					],
				},
			],
			type: 'query',
			prefixes: prefixes,
		};

		const actual = builder.buildFromQueryRepresentation( {
			conditions: [
				{
					propertyId: 'P281',
					value: 'XXXX',
					datatype: 'string',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					subclasses: false,
					conditionRelation: null,
					negate: false,
				},
			],
			omitLabels: true,
		} );

		expect( actual ).toStrictEqual( expected );
	} );

	it( 'with quantity value', () => {
		// TODO: replace this test when correct implementation is done
		// in https://phabricator.wikimedia.org/T276938
		const builder = new QueryObjectBuilder();

		const quantityQueryRepresentation = {
			conditions: [
				{
					propertyId: 'P281',
					value: { value: 12345, unit: 'mts' },
					datatype: 'quantity',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					subclasses: false,
					conditionRelation: null,
					negate: false,
				},
			],
			omitLabels: true,
		};

		expect( () => {
			builder.buildFromQueryRepresentation( quantityQueryRepresentation );
		} ).toThrow();
	} );

	it( 'with limit', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const expected = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
			],
			where: [
				{
					type: 'bgp',
					triples: [
						{
							subject: {
								termType: 'Variable',
								value: 'item',
							},
							predicate: { type: 'path',
								pathType: '/',
								items: [ {
									termType: 'NamedNode',
									value: 'http://www.wikidata.org/prop/P281',
								},
								{
									termType: 'NamedNode',
									value: 'http://www.wikidata.org/prop/statement/P281',
								},
								] },
							object: {
								termType: 'Literal',
								value: 'XXXX',
							},
						},
					],
				},
			],
			limit: 20,
			type: 'query',
			prefixes: prefixes,
		};

		const actual = builder.buildFromQueryRepresentation( {
			conditions: [
				{
					propertyId: 'P281',
					value: 'XXXX',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					datatype: 'string',
					subclasses: false,
					conditionRelation: null,
					negate: false,
				},
			],
			omitLabels: true,
			limit: 20,
		} );

		expect( actual ).toStrictEqual( expected );
	} );

	it( 'with labels (omitLabels = false)', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const internalExpectedQuery = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
			],
			where: [
				{
					type: 'bgp',
					triples: [
						{
							subject: {
								termType: 'Variable',
								value: 'item',
							},
							predicate: { type: 'path',
								pathType: '/',
								items: [ {
									termType: 'NamedNode',
									value: 'http://www.wikidata.org/prop/P281',
								},
								{
									termType: 'NamedNode',
									value: 'http://www.wikidata.org/prop/statement/P281',
								},
								] },
							object: {
								termType: 'Literal',
								value: 'XXXX',
							},
						},
					],
				},
			],
			type: 'query',
		};

		const expected = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
				{
					termType: 'Variable',
					value: 'itemLabel',
				},
			],
			where: [
				{
					type: 'service',
					patterns: [
						{
							type: 'bgp',
							triples: [ {
								subject: {
									termType: 'NamedNode',
									value: 'http://www.bigdata.com/rdf#serviceParam',
								},
								predicate: {
									termType: 'NamedNode',
									value: 'http://wikiba.se/ontology#language',
								},
								object: {
									termType: 'Literal',
									value: '[AUTO_LANGUAGE]',
								},
							} ],
						},
					],
					name: {
						termType: 'NamedNode',
						value: 'http://wikiba.se/ontology#label',
					},
					silent: false,
				},
				{
					type: 'group',
					patterns: [
						internalExpectedQuery,
					],
				},
			],
			type: 'query',
			prefixes: prefixes,
		};

		const actual = builder.buildFromQueryRepresentation( {
			conditions: [
				{
					propertyId: 'P281',
					value: 'XXXX',
					datatype: 'string',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					subclasses: false,
					conditionRelation: null,
					negate: false,
				},
			],
			omitLabels: false,
		} );

		expect( actual ).toMatchObject( expected );
	} );

	it( 'with subclasses', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const expected = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
			],
			where: [
				{
					type: 'bgp',
					triples: [
						{
							subject: {
								termType: 'Variable',
								value: 'item',
							},
							predicate: { type: 'path',
								pathType: '/',
								items: [ {
									termType: 'NamedNode',
									value: 'http://www.wikidata.org/prop/P281',
								},
								{
									termType: 'NamedNode',
									value: 'http://www.wikidata.org/prop/statement/P281',
								},
								{
									type: 'path',
									pathType: '*',
									items: [ {
										termType: 'NamedNode',
										value: 'http://www.wikidata.org/prop/direct/P279',
									},
									],
								},
								] },
							object: {
								termType: 'NamedNode',
								value: 'http://www.wikidata.org/entity/Q456',
							},
						},
					],
				},
			],
			type: 'query',
			prefixes: prefixes,
		};

		const actual = builder.buildFromQueryRepresentation( {
			conditions: [
				{
					propertyId: 'P281',
					value: 'Q456',
					datatype: 'wikibase-item',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					subclasses: true,
					conditionRelation: null,
					negate: false,
				},
			],
			omitLabels: true,
		} );

		expect( actual ).toStrictEqual( expected );
	} );

	it( 'with negate', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const expected = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
			],
			where: [
				{
					triples: [
						{
							object: {
								termType: 'BlankNode',
								value: 'anyValue',
							},
							predicate: {
								termType: 'NamedNode',
								value: 'http://wikiba.se/ontology#sitelinks',
							},
							subject: {
								termType: 'Variable',
								value: 'item',
							},
						},
					],
					type: 'bgp',
				},
				{
					type: 'minus',
					patterns: [
						{
							type: 'bgp',
							triples: [
								{
									subject: {
										termType: 'Variable',
										value: 'item',
									},
									predicate: { type: 'path',
										pathType: '/',
										items: [ {
											termType: 'NamedNode',
											value: 'http://www.wikidata.org/prop/P281',
										},
										{
											termType: 'NamedNode',
											value: 'http://www.wikidata.org/prop/statement/P281',
										},
										] },
									object: {
										termType: 'Literal',
										value: 'XXXX',
									},
								},
							],
						},
					],
				},
			],
			type: 'query',
			prefixes: prefixes,
		};

		const actual = builder.buildFromQueryRepresentation( {
			conditions: [
				{
					propertyId: 'P281',
					value: 'XXXX',
					datatype: 'string',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					subclasses: false,
					conditionRelation: null,
					negate: true,
				},
			],
			omitLabels: true,
		} );

		expect( actual ).toStrictEqual( expected );
	} );

	it( 'with negate but labels enabled', () => {
		const prefixes = allNamespaces;
		const builder = new QueryObjectBuilder();
		const internalExpectedQuery = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
			],
			where: [
				{
					triples: [
						{
							object: {
								termType: 'BlankNode',
								value: 'anyValue',
							},
							predicate: {
								termType: 'NamedNode',
								value: 'http://wikiba.se/ontology#sitelinks',
							},
							subject: {
								termType: 'Variable',
								value: 'item',
							},
						},
					],
					type: 'bgp',
				},
				{
					type: 'minus',
					patterns: [
						{
							type: 'bgp',
							triples: [
								{
									subject: {
										termType: 'Variable',
										value: 'item',
									},
									predicate: { type: 'path',
										pathType: '/',
										items: [ {
											termType: 'NamedNode',
											value: 'http://www.wikidata.org/prop/P281',
										},
										{
											termType: 'NamedNode',
											value: 'http://www.wikidata.org/prop/statement/P281',
										},
										] },
									object: {
										termType: 'Literal',
										value: 'XXXX',
									},
								},
							],
						},
					],
				},
			],
			type: 'query',
			prefixes: {},
		};
		const expected = {
			queryType: 'SELECT',
			distinct: true,
			variables: [
				{
					termType: 'Variable',
					value: 'item',
				},
				{
					termType: 'Variable',
					value: 'itemLabel',
				},
			],
			where: [
				{
					type: 'service',
					patterns: [
						{
							type: 'bgp',
							triples: [ {
								subject: {
									termType: 'NamedNode',
									value: 'http://www.bigdata.com/rdf#serviceParam',
								},
								predicate: {
									termType: 'NamedNode',
									value: 'http://wikiba.se/ontology#language',
								},
								object: {
									termType: 'Literal',
									value: '[AUTO_LANGUAGE]',
								},
							} ],
						},
					],
					name: {
						termType: 'NamedNode',
						value: 'http://wikiba.se/ontology#label',
					},
					silent: false,
				},
				{
					type: 'group',
					patterns: [ internalExpectedQuery ],
				},
			],
			type: 'query',
			prefixes: prefixes,
		};

		const actual = builder.buildFromQueryRepresentation( {
			conditions: [
				{
					propertyId: 'P281',
					value: 'XXXX',
					datatype: 'string',
					propertyValueRelation: PropertyValueRelation.Matching,
					referenceRelation: ReferenceRelation.Regardless,
					subclasses: false,
					conditionRelation: null,
					negate: true,
				},
			],
			omitLabels: false,
		} );

		expect( actual ).toStrictEqual( expected );
	} );

} );
