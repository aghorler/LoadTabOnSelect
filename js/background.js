var managedTabs = [];

function handleCreated(tab){
	var managedTab = {id: tab.id, initialUrl: tab.url, loadedUrl: null};
	managedTabs.push(managedTab);
	console.log("onCreated run.");
}

function handleUpdated(tabId, changeInfo, tabInfo){
	var i;
	for(i = 0; i < managedTabs.length; i++){
		if(managedTabs[i].id == tabId && changeInfo.url !== undefined && changeInfo.url !== "about:blank" && managedTabs[i].loadedUrl == null){
			console.log("initialUrl: " + managedTabs[i].initialUrl + ". For " + managedTabs[i].id);

			managedTabs[i].loadedUrl = changeInfo.url;
			console.log("loadedUrl: " + managedTabs[i].loadedUrl);

			browser.tabs.update(managedTabs[i].id, {
				url: "about:blank"
			});
		}
	}
}

function handleActivated(activeInfo){
	console.log("onActivated run.");
	var i;
	for(i = 0; i < managedTabs.length; i++){
		if(activeInfo.tabId == managedTabs[i].id){
			browser.tabs.update(managedTabs[i].id, {
				url: managedTabs[i].loadedUrl
			});
			managedTabs.pop(managedTabs[i]);
		}
	}
}

browser.tabs.onCreated.addListener(handleCreated);
browser.tabs.onUpdated.addListener(handleUpdated);
browser.tabs.onActivated.addListener(handleActivated);
