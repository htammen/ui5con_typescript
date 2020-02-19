# UI5con_typescript
This is the material of my **UI5 with Typescript** talk I gave at UI5Con 2020 in Brussels.

## Workspace structure
### Folder de.tammenit.uhdapp
In this folder you find the sourcecode of my example project I used to demonstrate the usage of typescript in UI5 development.  
This app is a very little application that I`ve written for the user help desk of a company. The UHD agents can enter a username, 
id, email address in a search field. When they press enter or select a user with the mouse they get information about this user 
in an Object page layout view.  
All shown data is dynamically created by a mockserver.  

Start the application by entering `npm start` at the command prompt.

### Folder presi
In this folder you find the presentation source. To read the content of the presentation just open the `README.md` file either 
with any text editor, with a markdown rendering tool or simply go to the [github repo](https://github.com/htammen/ui5con_typescript/tree/master/presi).

Btw. I named this folder presi cause I used the markdown presentation software [markpress](https://github.com/gamell/markpress) which in turn uses [impress](https://github.com/impress/impress.js/).
Impress implemented some of the features the presentation tool [Prezi](https://prezi.com/) offers which I used for former presentations. 
So I thought naming the folder **pre~~z~~si** was a good idea. 

### Folder tssandbox
The folder tssandbox contains some simple core Typescript examples

### Folder .devcontainer
If you have installed the [VS Code Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension you are automatically asked if you want to open this workspace in an isolated docker container as soon as you open the workspace file [ui5con_brussels.code-workspace](https://github.com/htammen/ui5con_typescript/blob/master/ui5con_brussels.code-workspace) in VS Code.
