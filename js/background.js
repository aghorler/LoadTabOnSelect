/* Array used to temporarily store tab IDs. */
var managedTabs = [];

/* Function to store a newly-created tab's id to the managedTabs array. */
function handleCreated(tab){
	managedTabs.push(tab.id);
}

/* Function to wait until the url of the tab is set, and redirect the loaded tab to a local addon page. */
function handleUpdated(tabId, changeInfo, tabInfo){
	if(changeInfo.url !== undefined && managedTabs.includes(tabId) && !changeInfo.url.startsWith("moz-extension://") && !changeInfo.url.startsWith("about:")){
		browser.tabs.update(tabId, {
			url: "html/tab.html?managedUrl=" + changeInfo.url
		});
	}
}

/* Function to redirect a selected tab to its actual url. */
function handleActivated(activeInfo){
	browser.tabs.get(activeInfo.tabId).then(function(tab){
		if(tab.url.startsWith(browser.extension.getURL("/html/tab.html?managedUrl="))){
			browser.tabs.update(activeInfo.tabId, {
				url: tab.url.split("/html/tab.html?managedUrl=")[1]
			});
		}
	}).then(function(){
		managedTabs.splice(managedTabs.indexOf(activeInfo.tabId), 1);
	});
}

browser.tabs.onCreated.addListener(handleCreated);
browser.tabs.onUpdated.addListener(handleUpdated);
browser.tabs.onActivated.addListener(handleActivated);
