---
# run docker server: docker run --rm --name slate -p 4567:4567 -v $(pwd)/source:/srv/slate/source slate serve
title: API Reference

language_tabs: # must be one of https://github.com/rouge-ruby/rouge/wiki/List-of-supported-languages-and-lexers
  # - shell
  # - ruby
  - python
  - javascript

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

# Introduction

Welcome to the EFADRIN API! You can use our API to access EFADRIN API endpoints, which can get information on various financial queries.

We have language bindings in Python! You can view code examples in the dark area to the right.

# Authentication

> To authorize, use this code:

```python
import requests
import json

# API endpoint
url = 'http://localhost:8089/api/v1/users'


```

> Make sure to replace `meowmeowmeow` with your API key.

PeelHunt uses API keys to allow access to the API. You can register a new PeelHunt API key at our [developer portal](http://172.183.157.113:5173/login).

PeelHunt expects for the API key to be included in all API requests to the server in a header that looks like the following:

`Authorization: meowmeowmeow`

<aside class="notice">
You must replace <code>meowmeowmeow</code> with your personal API key.
</aside>

# DocSearch API

The DocSearch API allows you to search and retrieve document information based on various criteria.

## Endpoint

```
POST /webapi/4/dev/efawebapi.asmx
```

Host: `hkg.efadrin.biz`

## Parameters

| Parameter      | Type   | Description                               |
| -------------- | ------ | ----------------------------------------- |
| AccountName    | string | User account identifier                   |
| SearchText     | string | Text to search for within documents       |
| SearchType     | string | Type of search to perform                 |
| SearchTop      | string | Maximum number of results to return       |
| LanguageID     | string | Language identifier for filtering results |
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

The API returns an XML response containing document information. Each document result includes:

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
