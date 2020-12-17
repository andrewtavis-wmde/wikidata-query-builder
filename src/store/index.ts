import Vue from 'vue';
import Vuex, { Store } from 'vuex';

import createActions from './actions';
import mutations from './mutations';
import getters from './getters';
import QueryBuilderServices from '@/QueryBuilderServices';
import RootState, { PropertyData } from '@/store/RootState';
import PropertyValueRelation from '@/data-model/PropertyValueRelation';
import Error from '@/data-model/Error';

Vue.use( Vuex );

export function newEmptyPropertyData( propertyError: Error|null = null ): PropertyData {
	return {
		label: '',
		id: '',
		datatype: null,
		propertyError,
	};
}

export const conditionRow = {
	propertyData: newEmptyPropertyData(),
	valueData: {
		value: '',
		valueError: null,
	},
	propertyValueRelationData: {
		value: PropertyValueRelation.Matching,
	},
};

export function createStore( services: QueryBuilderServices ): Store<RootState> {

	return new Store( {
		state: {
			conditionRows: [ conditionRow ],
			errors: [],
		},
		actions: createActions(
			services.get( 'searchEntityRepository' ),
			services.get( 'metricsCollector' ),
		),
		mutations,
		getters,
		modules: {},
	} );

}
