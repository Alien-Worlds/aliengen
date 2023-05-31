export default {
  exportsTemplate: "exports.hbs",
  iocConfigTemplate: "ioc.config.hbs",
  repositoryTemplate: "repository.hbs",
  dtosTemplate: "dtos.hbs",
  collectiveDataTypeTemplate: "collective-dto.hbs",
  collectiveEntityTemplate: "collective-entity.hbs",
  entitiesTemplate: "entities.hbs",
  Actions: {
    dataSourceTemplate: "actions/data-source.action.hbs",
    enumsTemplate: "actions/enums.action.hbs",
    contractActionMappersTemplate: "actions/contract-action-mappers.hbs",
    mapperTemplate: "actions/mapper.action.hbs",
  },
  Deltas: {
    enumsTemplate: "deltas/enums.delta.hbs",
    dataSourceTemplate: "deltas/data-source.delta.hbs",
    contractDeltasMappersTemplate: "deltas/contract-delta-mappers.hbs",
    mapperTemplate: "deltas/mapper.delta.hbs",
  },
  Services: {
    definitionTemplate: "services/definition.service.hbs",
    implementationTemplate: "services/implementation.service.hbs",
  },
};
