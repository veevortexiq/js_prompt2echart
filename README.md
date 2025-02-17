# Project Setup and Usage

## Prerequisites

*   Node.js and npm installed
*   An Azure OpenAI Service account and API key
*   A Google Cloud project and API key for the Gemini API (if using the query generation functionality)

## Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

## Configuration

1.  Create a `.env` file in the root directory of the project.
2.  Add the following environment variables to the `.env` file, replacing the placeholder values with your actual credentials:

    ```
    AZURE_ENDPOINT=your_azure_endpoint_url
    AZURE_API_KEY=your_azure_api_key
    GOOGLE_API_KEY=your_google_api_key (if using Gemini API)
    ```

## Running the Application

1.  Start the Node.js server:

    ```bash
    node app.js
    ```

    The server will start running at `http://localhost:3000`.

2.  Open the HTML files in your browser to test the different functionalities:

    *   `genQuery.html`: Tests the query generation endpoint.
    *   `genReport.html`: Tests the report generation endpoint.
    *   `genChart.html`: Tests the chart generation endpoint.

## Functionality

### Query Generation

The `genQuery.html` file allows you to test the query generation endpoint. It sends a prompt to the server, which uses the Gemini API to generate a query. The streaming response is displayed in the browser.

### Report Generation

The `genReport.html` file allows you to test the report generation endpoint. It sends a user question, a generated query, and an OpenSearch response to the server, which uses the Gemini API to generate a human-readable report. The report is displayed in the browser.

### Chart Generation

The `genChart.html` file allows you to test the chart generation endpoint. It sends a user question, a generated query, and an OpenSearch response to the server, which uses the Azure OpenAI Service to generate an EChart JSON configuration. The chart is then rendered in the browser using the ECharts library.

## Dependencies

*   express
*   cors
*   dotenv
*   axios
*   @google-cloud/aiplatform (if using Gemini API)
*   echarts (for chart rendering in the browser)

## Endpoints

### generateQuery

The `generateQuery` function is used to generate Elasticsearch QueryDSL from natural language requests. It takes two parameters:

1. `user_input`: The user's natural language request.
2. `index_name`: The name of the Elasticsearch index to target.

The function returns a stream of text chunks, which together form the generated Elasticsearch QueryDSL.


### generateReport

The `generateReport` function is used to analyze a technical query/response pair and convert it into clear business insights. It takes three parameters:

1. `userQuestion`: The user's original question.
2. `GeneratedQuery`: The generated Elasticsearch QueryDSL.
3. `opensearchResponse`: The response from OpenSearch.

The function returns a stream of text chunks, which together form the generated report.





### generateChart

The `generateChart` function is used to generate a chart from a technical query/response pair. It takes three parameters:

1. `userQuestion`: The user's original question.
2. `GeneratedQuery`: The generated Elasticsearch QueryDSL.
3. `opensearchResponse`: The response from OpenSearch.

The function returns a JSON object representing the generated chart.


## Notes

*   Make sure your Azure OpenAI Service and Google Cloud project are properly configured and that you have the necessary permissions to access the APIs.
*   The example data in the HTML files is just for testing purposes. Replace it with your actual data.
*   The EChart JSON configuration generated by the server needs to be valid and compatible with the ECharts library.
