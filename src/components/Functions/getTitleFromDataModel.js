// Function to get the Title Variable for each component
function getTitleFromDataModel(dataModel, propertyName) {
  return dataModel.properties[propertyName].UI.UIVariables.UITitle;
}

export default getTitleFromDataModel;
