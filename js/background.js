var managedTabs = [];

function handleCreated(tab){
	var managedTab = {id: tab.id, initialUrl: tab.url, loadedUrl: null};
	managedTabs.push(managedTab);
}

function handleUpdated(tabId, changeInfo, tabInfo){
	var i;
	for(i = 0; i < managedTabs.length; i++){
		if(managedTabs[i].id == tabId && changeInfo.url !== undefined && changeInfo.url !== "about:blank" && managedTabs[i].loadedUrl == null){

			managedTabs[i].loadedUrl = changeInfo.url;

			browser.tabs.update(managedTabs[i].id, {
				url: "about:blank"
			});

			break;
		}
	}
}

function handleActivated(activeInfo){
	var i;
	for(i = 0; i < managedTabs.length; i++){
		if(managedTabs[i].id == activeInfo.tabId){
			console.log(JSON.stringify(managedTabs));

			browser.tabs.update(managedTabs[i].id, {
				url: managedTabs[i].loadedUrl
			});

			managedTabs.splice(i, 1);

			break;
		}
	}
}

browser.tabs.onCreated.addListener(handleCreated);
browser.tabs.onUpdated.addListener(handleUpdated);
browser.tabs.onActivated.addListener(handleActivated);
