---
# run docker server: docker run --rm --name slate -p 4567:4567 -v $(pwd)/source:/srv/slate/source slate serve
title: API Reference

language_tabs: # must be one of https://github.com/rouge-ruby/rouge/wiki/List-of-supported-languages-and-lexers
  - python
  # - javascript

toc_footers:
  - <a href='#'>Sign Up for a Developer Key</a>
  - <a href='https://efadrin.com/'>Documentation Powered by EFADRIN</a>

includes:
  - errors

search: true

code_clipboard: true

meta:
  - name: description
    content: Documentation for the Kittn API
---

# API Documentation

The API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.

# Authentication

> To authorize, use this code:

```python
import requests
import json
from pprint import pprint

base_url = "https://api.efadrin.io/api/"
endpoint = "v1/token-validate"

request_url = base_url + endpoint
headers = {
    "X-Peelhunt-Token": "meowmeowmeow"
}

try:
  response = requests.post(request_url, headers=headers, json=arguments)
  data = response.json()
  print(json.dumps(data, indent=2, ensure_ascii=False))

except requests.exceptions.RequestException as e:
    print(f"Error making request: {e}")

except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")

except Exception as e:
    print(f"Unexpected error: {e}")
```

> Make sure to replace `meowmeowmeow` with your API key.

All requests require a header X-Peelhunt-Token: api-key. You can find your API Key after signing in [HERE](http://api.efadrin.io/login).

`Base URL: http://api.efadrin.io/api/`

`X-Peelhunt-Token: meowmeowmeow`

<aside class="notice">
You must replace <code>meowmeowmeow</code> with your personal API key.
</aside>

# DocSearch

The DocSearch API allows you to search and retrieve document information based on various criteria.

`Endpoint: /v1/docsearch`

## Arguments

```python
import requests
import json
from pprint import pprint

base_url = "https://api.efadrin.io/api/"
endpoint = "v1/docsearch"

request_url = base_url + endpoint
headers = {
    "X-Peelhunt-Token": "meowmeowmeow"
}

arguments = {
    "accountName": "FDRN_PEELHUNT",
    "searchText": "trading",
    "marketIds": "GB",
    "dateFrom": "2023-01-01",
    "dateTo": "2023-12-31",
    "searchTop": "1"
}

try:
    response = requests.post(request_url, headers=headers, json=arguments)
    data = response.json()
    print(json.dumps(data, indent=2, ensure_ascii=False))

except requests.exceptions.RequestException as e:
    print(f"Error making request: {e}")

except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")

except Exception as e:
    print(f"Unexpected error: {e}")
```

| Argument       | Type   | Description                               |
| -------------- | ------ | ----------------------------------------- |
| searchText     | string | Text to search for within documents       |
| searchType     | string | Type of search to perform                 |
| searchTop      | string | Maximum number of results to return       |
| docGuid        | string | Unique identifier for a specific document |
| reportTypeId   | string | Filter by report type identifier          |
| reportTypeName | string | Filter by report type name                |
| marketIds      | string | Filter by market identifiers              |
| sectorIds      | string | Filter by sector identifiers              |
| industryIds    | string | Filter by industry identifiers            |
| authorIds      | string | Filter by author identifiers              |
| corpIds        | string | Filter by corporation identifiers         |
| dateFrom       | string | Start date for document search            |
| dateTo         | string | End date for document search              |
| orderNewToOld  | string | Sort order for results                    |

### Note

- Market, Sector, Industry, Author, and Corporation IDs can be provided as comma-separated values
- The API supports both single document retrieval (using DocGUID) and multi-document search

## Response Structure

The API returns an JSON response containing document information. Each document result includes:

```json
{
  "header": {
    "recordCount": 1,
    "statusCode": 0,
    "statusMsg": ""
  },
  "documents": [
    {
      "docGuid": "a7a39aa8-ba82-41c2-b7bf-da414bcdf422",
      "docId": 9876,
      "docType": {
        "id": 300
      },
      "rixmlType": "Company Note Long",
      "markets": [
        {
          "id": "GB"
        }
      ],
      "sectors": [
        {
          "id": 8
        }
      ],
      "industries": [
        {
          "id": 14
        }
      ],
      "authors": [
        {
          "id": 21623
        }
      ],
      "corps": [
        {
          "id": 517
        }
      ],
      "docTitle": "#TRENDING",
      "docSynopsis": "·  LBG is one of the UK’s largest social digital publishers, focused on a notoriously difficult demographic to reach – youths.|·  We address near-term headwinds from declining ad yields with conservatism in our forecasts, and steps that management have taken.|·  Going forward, we see many growth avenues, including building up a US Direct business, diversifying across social media platforms, and M&A.",
      "publicationDate": "2023-01-10",
      "publicationDateTime": "2023-01-10T17:54:38.060",
      "rank": 6,
      "isCompendium": false
    }
  ]
}
```

### Header Section

- recordCount: Total number of records found
- statusCode: Operation status code
- statusMsg: Status message (if any)

### Document Information

- docGuid: Unique document identifier
- docId: Document ID
- docType: Document type information with ID
- rixmlType: Report type name
- markets: List of market identifiers
- sectors: List of sector identifiers (if applicable)
- industries: List of industry identifiers (if applicable)
- authors: List of author identifiers
- corps: List of corporation identifiers (if applicable)
- docTitle: Document title
- docSynopsis: Document summary (if available)
- publicationDate: Document publication date
- publicationDateTime: Full publication timestamp
- publicationDateTimeNoMSecs: Publication timestamp without milliseconds
- rank: Document ranking
- isCompendium: Boolean flag indicating if document is part of a compendium

## Error Handling

The API returns a StatusCode and StatusMsg in the response header to indicate the success or failure of the request. A StatusCode of 0 typically indicates a successful request.

# DocRetrieve

The DocRetrieve API allows you to retrieve a document based on various criteria.

`Endpoint: /v1/docretrieve`

## Arguments

```python
import requests
import json
from pprint import pprint

base_url = "https://api.efadrin.io/api/"
endpoint = "v1/docretrieve"

request_url = base_url + endpoint

headers = {
    "X-Peelhunt-Token": "meowmeowmeow"
}

arguments = {
    "accountName": "FDRN_PEELHUNT",
    "docGuid":"6063300d-4452-43a2-9719-f041453cd5f8",
    "docType":"1"
}

try:
    response = requests.post(request_url, headers=headers, json=arguments)
    data = response.json()
    print(json.dumps(data, indent=2, ensure_ascii=False))

except requests.exceptions.RequestException as e:
    print(f"Error making request: {e}")

except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")

except Exception as e:
    print(f"Unexpected error: {e}")
```

| Argument           | Type   | Description                                                       |
| ------------------ | ------ | ----------------------------------------------------------------- |
| docGuid `required` | string | Unique identifier for a specific document                         |
| docType `required` | string | Retrival formal of the document i.e. 1 = PDF, 2 = JSON, 5 = RIXML |

## Response Structure

The API returns an JSON response containing document information. Each document result includes:

```json
{
  "filename": "220707_Persimmon MN BC.pdf",
  "docGuid": "6063300d-4452-43a2-9719-f041453cd5f8",
  "pdfBinary": "JVBERi0xLjUNCiW1tbW1DQoxIDAgb2JqDQo8PC9UeXBlL0NhdGF"
}
```

> `pdfBinary` is in `base64` format.

- fileName: Name of the PDF File
- docGuid: Unique identifier for a specific document
- pdfBinary: `pdfBinary` is in `base64` format.
