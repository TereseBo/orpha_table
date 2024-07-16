# ORPHA list
This application allows for creatig custom lists of selected rare diseases, including ORPHAcode, ICD-10, preffered name and synonyms by utilizing the Orphanet API. Lists can be exported to Excel or as JSON for further use. 

If you need a to keep a list of the specific codes relevant for you personally in your daily clinicl work, ERN reporting or any other task, this is the tool for easy creation of your personalized list. 

Start by searching for a ORPHAcode, ICD-10 code or disease name (in English). Fill in the search term, check the appropriate type and press the searh button. Any matching diseases will become visible in the resluts table below the searchbox. Select the disorders you wish to include in your list by clicking the folder icon in the results table, or remove diseases outside your scope of interest by clicking the X icon. Your selected diseases will be visible in the table of selected diseases at the bottom of the page. 

Added the wrong diagnosis? No problem, remove it by clicking the X button.

Have you added all diseases you need? Add a name for your file by filling in the designated field above the table and click the button to download your freshly created list in your desired format. 

## Running your own instance
Clone the repository from gitHub and navigate to the root folder:  

```git clone https://github.com/TereseBo/orpha_table.git```  

```cd orpha_table```  

To install requirements run:  

```npm i ``` 

In order to run the application, you will also need to create and add an Orphanet API key to the project as described below under "Environment" and start the project as described under "Running the application" 

## Environment
The application requires an API key for access to the Orphanet API. To create one, navigate to https://api.orphacode.org/ 

#### [Create API key ](https://api.orphacode.org/)

```click the green "Authorize" button ```

```add your key```

```click the green "Authorize" button ```

You have now created and authorized your key and can use it to access the Orphanet API. To use your key, create a .env file in the root directory (orpha_table) and add your key as "ORPHA_API_KEY. 

```ORPHA_API_KEY=key goes here```

## Running the application

To start the development server run:

```npm next dev ``` 

Navigate to the browser by ctrl clicking the link in the terminal or open a browser and write the url manually. Usually you will find the application at [http://localhost:3000](http://localhost:3000).

Now you are good to go. Any changes you make to the project will be visible in your browser.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).