---
# run docker server: docker run --rm --name slate -p 4567:4567 -v $(pwd)/source:/srv/slate/source slate serve
title: API Reference

language_tabs: # must be one of https://github.com/rouge-ruby/rouge/wiki/List-of-supported-languages-and-lexers
  # - shell
  # - ruby
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

# API endpoint
headers = {
    "api-token": "meowmeowmeow"
}

url = 'http://api.efadrin.io/api/v1/authorize-token'

try:
  response = requests.post(url, headers=headers, json=payload)
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

All GET request require a header X-Peelhunt-Token : apiKey. You can find your API Key after signing in [here].(http://api.efadrin.io/login).

<!-- If you are logged in, your API key will be automatically used in the examples so you can copy and paste them as is. -->

`X-Peelhunt-Token: meowmeowmeow`

<aside class="notice">
You must replace <code>meowmeowmeow</code> with your personal API key.
</aside>

# DocSearch API

The DocSearch API allows you to search and retrieve document information based on various criteria.

## Endpoint

```python
import requests
import json
from pprint import pprint

# Your configuration
url = "https://api.efadrin.io/api/v1/docsearch"
headers = {
    "X-Peelhunt-Token": "meowmeowmeow"
}

payload = {
    "accountName": "FDRN_PEELHUNT",
    "searchText": "trading",
    "marketIds": "GB",
    "dateFrom": "2023-01-01",
    "dateTo": "2023-12-31",
    "searchTop": "1"
}

try:
    # Make request
    response = requests.post(url, headers=headers, json=payload)
    data = response.json()
    print(json.dumps(data, indent=2, ensure_ascii=False))

except requests.exceptions.RequestException as e:
    print(f"Error making request: {e}")

except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")

except Exception as e:
    print(f"Unexpected error: {e}")
```

Host: `api.efadrin.biz`

<!-- ## Arguments -->

| Argument       | Type   | Description                               |
| -------------- | ------ | ----------------------------------------- |
| SearchText     | string | Text to search for within documents       |
| SearchType     | string | Type of search to perform                 |
| SearchTop      | string | Maximum number of results to return       |
| DocGUID        | string | Unique identifier for a specific document |
| ReportTypeID   | string | Filter by report type identifier          |
| ReportTypeName | string | Filter by report type name                |
| MarketIDs      | string | Filter by market identifiers              |
| SectorIDs      | string | Filter by sector identifiers              |
| IndustryIDs    | string | Filter by industry identifiers            |
| AuthorIDs      | string | Filter by author identifiers              |
| CorpIDs        | string | Filter by corporation identifiers         |
| DateFrom       | string | Start date for document search            |
| DateTo         | string | End date for document search              |
| OrderNewToOld  | string | Sort order for results                    |

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

- RecordCount: Total number of records found
- StatusCode: Operation status code
- StatusMsg: Status message (if any)

### Document Information

- DocGUID: Unique document identifier
- DocID: Document ID
- DocType: Document type information with ID
- RIXMLType: Report type name
- Markets: List of market identifiers
- Sectors: List of sector identifiers (if applicable)
- Industries: List of industry identifiers (if applicable)
- Authors: List of author identifiers
- Corps: List of corporation identifiers (if applicable)
- DocTitle: Document title
- DocSynopsis: Document summary (if available)
- PublicationDate: Document publication date
- PublicationDateTime: Full publication timestamp
- PublicationDateTimeNoMSecs: Publication timestamp without milliseconds
- Rank: Document ranking
- IsCompendium: Boolean flag indicating if document is part of a compendium

## Request Examples

### HTTP GET

```
GET /webapi/4/dev/efawebapi.asmx/EFADocSearch?AccountName=string&SearchText=string... HTTP/1.1
Host: hkg.efadrin.biz
```

## Error Handling

The API returns a StatusCode and StatusMsg in the response header to indicate the success or failure of the request. A StatusCode of 0 typically indicates a successful request.

## Notes

- All date parameters should be provided in a string format
- Market, Sector, Industry, Author, and Corporation IDs can be provided as comma-separated values
- The API supports both single document retrieval (using DocGUID) and multi-document search
- Results can be ordered from newest to oldest using the OrderNewToOld parameter
