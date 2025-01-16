// efaapi.go - Simple API server for EFA API
package apitoken

import (
	"bytes"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"
)

// Configuration struct
type Config struct {
	EFAEndpoint string
	AuthToken   string
}

// API key storage interface
type APIKeyStore interface {
	IsValidKey(apiKey string) bool
}

// Simple in-memory API key store
type InMemoryAPIKeyStore struct {
	validKeys map[string]bool
}

func NewInMemoryAPIKeyStore() *InMemoryAPIKeyStore {
	return &InMemoryAPIKeyStore{
		validKeys: make(map[string]bool),
	}
}

func (s *InMemoryAPIKeyStore) AddKey(apiKey string) {
	s.validKeys[apiKey] = true
}

func (s *InMemoryAPIKeyStore) IsValidKey(apiKey string) bool {
	return s.validKeys[apiKey]
}

// Request structures
type DocSearchRequest struct {
	AccountName    string `json:"accountName"`
	SearchText     string `json:"searchText"`
	SearchType     string `json:"searchType"`
	SearchTop      string `json:"searchTop"`
	LanguageID     string `json:"languageId"`
	DocGUID        string `json:"docGuid"`
	ReportTypeID   string `json:"reportTypeId"`
	ReportTypeName string `json:"reportTypeName"`
	MarketIDs      string `json:"marketIds"`
	SectorIDs      string `json:"sectorIds"`
	IndustryIDs    string `json:"industryIds"`
	AuthorIDs      string `json:"authorIds"`
	CorpIDs        string `json:"corpIds"`
	DateFrom       string `json:"dateFrom"`
	DateTo         string `json:"dateTo"`
	OrderNewToOld  string `json:"orderNewToOld"`
}

// Response structures
type DocSearchResponse struct {
	Header    Header     `json:"header"`
	Documents []Document `json:"documents"`
}
type DocRetrieveResponse struct {
	FileName string `json:"filename"`
	DocGuid  string `json:"docGuid"`
}
type DocRetrieveResponsePDF struct {
	DocRetrieveResponse
	PDFBinary string `json:"pdfBinary"`
}
type DocRetrieveResponseTXT struct {
	DocRetrieveResponse
	FreeText string `json:"freeText"`
}
type DocRetrieveResponseRIXML struct {
	DocRetrieveResponse
	RIXMLData string `json:"rixmlData"`
}
type DocRetrieveRequest struct {
	AccountName string `json:"accountName"`
	DocGUID     string `json:"docGUID"`
	DocType     string `json:"docType"`
}

type Header struct {
	RecordCount int    `json:"recordCount"`
	StatusCode  int    `json:"statusCode"`
	StatusMsg   string `json:"statusMsg"`
}

type Document struct {
	DocGUID             string     `json:"docGuid"`
	DocID               int        `json:"docId"`
	DocType             DocType    `json:"docType"`
	RIXMLType           string     `json:"rixmlType"`
	Markets             []Market   `json:"markets"`
	Sectors             []Sector   `json:"sectors,omitempty"`
	Industries          []Industry `json:"industries,omitempty"`
	Authors             []Author   `json:"authors"`
	Corps               []Corp     `json:"corps,omitempty"`
	DocTitle            string     `json:"docTitle"`
	DocSynopsis         string     `json:"docSynopsis,omitempty"`
	PublicationDate     string     `json:"publicationDate"`
	PublicationDateTime string     `json:"publicationDateTime"`
	Rank                int        `json:"rank"`
	IsCompendium        bool       `json:"isCompendium"`
}

type DocType struct {
	ID int `json:"id"`
}

type Market struct {
	ID string `json:"id"`
}

type Sector struct {
	ID int `json:"id"`
}

type Industry struct {
	ID int `json:"id"`
}

type Author struct {
	ID int `json:"id"`
}

type Corp struct {
	ID int `json:"id"`
}

// XML response structures for parsing
type XMLResponse struct {
	Body SoapBody `xml:"Body"`
}
type XMLResponseDocRetrieve struct {
	Body SoapBodyDocRetrieve `xml:"Body"`
}

type SoapBody struct {
	EFADocSearchResponse EFADocSearchResponse `xml:"EFADocSearchResponse"`
}
type EFADocSearchResponse struct {
	EFADocSearchResult EFADocSearchResult `xml:"EFADocSearchResult"`
}
type EFADocSearchResult struct {
	EFADocSearch EFADocSearch `xml:"EFADocSearch"`
}
type EFADocSearch struct {
	Header    EFADocSearch_Header `xml:"Header"`
	DocSearch []DocSearch         `xml:"DocSearch"`
}

type SoapBodyDocRetrieve struct {
	EFADocRetrieveResponse EFADocRetrieveResponse `xml:"EFADocRetrieveResponse"`
}
type EFADocRetrieveResponse struct {
	EFADocRetrieveResult EFADocRetrieveResult `xml:"EFADocRetrieveResult"`
}
type EFADocRetrieveResult struct {
	EFADocRetrieve EFADocRetrieve `xml:"EFADocRetrieve"`
}
type EFADocRetrieve struct {
	DocPDF DocPDF `xml:"DocPDF"`
}
type EFADocRetrievePDF struct {
	DocPDF DocPDF `xml:"Body>EFADocRetrieveResponse>EFADocRetrieveResult>EFADocRetrieve>DocPDF"`
}
type DocPDF struct {
	FileName  string `xml:"FileName"`
	DocGUID   string `xml:"DocGUID"`
	PDFBinary string `xml:"PDFBinary"`
}
type EFADocRetrieveTXT struct {
	DocText DocText `xml:"Body>EFADocRetrieveResponse>EFADocRetrieveResult>EFADocRetrieve>DocText"`
}
type DocText struct {
	FileName string `xml:"FileName"`
	DocGUID  string `xml:"DocGUID"`
	FreeText string `xml:"FreeText"`
}
type EFADocRetrieveRIXML struct {
	DocRIXML DocRIXML `xml:"Body>EFADocRetrieveResponse>EFADocRetrieveResult>EFADocRetrieve>DocRIXML"`
}
type DocRIXML struct {
	FileName  string `xml:"FileName"`
	DocGUID   string `xml:"DocGUID"`
	RIXMLData string `xml:"RIXMLData,innerxml"`
}
type EFADocSearch_Header struct {
	RecordCount int    `xml:"RecordCount"`
	StatusCode  int    `xml:"StatusCode"`
	StatusMsg   string `xml:"StatusMsg"`
}

type DocSearch struct {
	DocGUID             string        `xml:"DocGUID"`
	DocID               int           `xml:"DocID"`
	DocType             XMLDocType    `xml:"DocType"`
	RIXMLType           string        `xml:"RIXMLType"`
	Markets             XMLMarkets    `xml:"Markets"`
	Sectors             XMLSectors    `xml:"Sectors"`
	Industries          XMLIndustries `xml:"Industries"`
	Authors             XMLAuthors    `xml:"Authors"`
	Corps               XMLCorps      `xml:"Corps"`
	DocTitle            string        `xml:"DocTitle"`
	DocSynopsis         string        `xml:"DocSynopsis"`
	PublicationDate     string        `xml:"PublicationDate"`
	PublicationDateTime string        `xml:"PublicationDateTime"`
	Rank                int           `xml:"Rank"`
	IsCompendium        int           `xml:"IsCompendium"`
}

type XMLDocType struct {
	ID int `xml:"ID,attr"`
}

type XMLMarkets struct {
	Market []XMLMarket `xml:"Market"`
}

type XMLMarket struct {
	ID string `xml:"ID,attr"`
}

type XMLSectors struct {
	Sector []XMLSector `xml:"Sector"`
}

type XMLSector struct {
	ID int `xml:"ID,attr"`
}

type XMLIndustries struct {
	Industry []XMLIndustry `xml:"Industry"`
}

type XMLIndustry struct {
	ID int `xml:"ID,attr"`
}

type XMLAuthors struct {
	Author []XMLAuthor `xml:"Author"`
}

type XMLAuthor struct {
	ID int `xml:"ID,attr"`
}

type XMLCorps struct {
	Corp []XMLCorp `xml:"Corp"`
}

type XMLCorp struct {
	ID int `xml:"ID,attr"`
}

// SOAP request structure
type soapEnvelope struct {
	XMLName xml.Name `xml:"soap:Envelope"`
	Soap    string   `xml:"xmlns:soap,attr"`
	Xsi     string   `xml:"xmlns:xsi,attr"`
	Xsd     string   `xml:"xmlns:xsd,attr"`
	Body    soapBody
}

type soapBody struct {
	XMLName      xml.Name `xml:"soap:Body"`
	EFADocSearch efaDocSearch
}

type efaDocSearch struct {
	XMLName        xml.Name `xml:"EFADocSearch"`
	Xmlns          string   `xml:"xmlns,attr"`
	AccountName    string
	SearchText     string
	SearchType     string
	SearchTop      string
	LanguageID     string
	DocGUID        string
	ReportTypeID   string
	ReportTypeName string
	MarketIDs      string
	SectorIDs      string
	IndustryIDs    string
	AuthorIDs      string
	CorpIDs        string
	DateFrom       string
	DateTo         string
	OrderNewToOld  string
	AuthToken      string
}

type soapEnvelopeDocRetrieve struct {
	XMLName xml.Name `xml:"soap:Envelope"`
	Soap    string   `xml:"xmlns:soap,attr"`
	Xsi     string   `xml:"xmlns:xsi,attr"`
	Xsd     string   `xml:"xmlns:xsd,attr"`
	Body    soapBodyDocRetrieve
}

type soapBodyDocRetrieve struct {
	XMLName        xml.Name `xml:"soap:Body"`
	EFADocRetrieve efaDocRetrieve
}

type efaDocRetrieve struct {
	XMLName     xml.Name `xml:"EFADocRetrieve"`
	Xmlns       string   `xml:"xmlns,attr"`
	AccountName string
	DocGUID     string
	DocType     string
	AuthToken   string
}

// Convert XML response to JSON structure
func convertToJSON(xmlData []byte) (*DocSearchResponse, error) {
	var xmlResp XMLResponse
	//var v interface{}
	if err := xml.Unmarshal(xmlData, &xmlResp); err != nil {
		return nil, fmt.Errorf("error unmarshaling SOAP response: %v", err)
	}

	fmt.Printf("DocSearch - EFA Response Body: %d\n", xmlResp.Body.EFADocSearchResponse.EFADocSearchResult.EFADocSearch.Header.RecordCount)

	/*
		var efaResult EFADocSearchResult
		if err := xml.Unmarshal([]byte(xmlResp.Body.EFADocSearchResponse.EFADocSearchResult), &efaResult); err != nil {
			return nil, fmt.Errorf("error unmarshaling search result: %v", err)
		}
	*/

	var efaResult EFADocSearch = xmlResp.Body.EFADocSearchResponse.EFADocSearchResult.EFADocSearch
	response := &DocSearchResponse{
		Header: Header{
			RecordCount: efaResult.Header.RecordCount,
			StatusCode:  efaResult.Header.StatusCode,
			StatusMsg:   efaResult.Header.StatusMsg,
		},
		Documents: make([]Document, len(efaResult.DocSearch)),
	}

	for i, xmlDoc := range efaResult.DocSearch {
		doc := Document{
			DocGUID:             xmlDoc.DocGUID,
			DocID:               xmlDoc.DocID,
			DocType:             DocType{ID: xmlDoc.DocType.ID},
			RIXMLType:           xmlDoc.RIXMLType,
			DocTitle:            xmlDoc.DocTitle,
			DocSynopsis:         xmlDoc.DocSynopsis,
			PublicationDate:     xmlDoc.PublicationDate,
			PublicationDateTime: xmlDoc.PublicationDateTime,
			Rank:                xmlDoc.Rank,
			IsCompendium:        xmlDoc.IsCompendium == 1,
		}

		// Convert Markets
		for _, m := range xmlDoc.Markets.Market {
			doc.Markets = append(doc.Markets, Market{ID: m.ID})
		}

		// Convert Sectors
		for _, s := range xmlDoc.Sectors.Sector {
			doc.Sectors = append(doc.Sectors, Sector{ID: s.ID})
		}

		// Convert Industries
		for _, i := range xmlDoc.Industries.Industry {
			doc.Industries = append(doc.Industries, Industry{ID: i.ID})
		}

		// Convert Authors
		for _, a := range xmlDoc.Authors.Author {
			doc.Authors = append(doc.Authors, Author{ID: a.ID})
		}

		// Convert Corps
		for _, c := range xmlDoc.Corps.Corp {
			doc.Corps = append(doc.Corps, Corp{ID: c.ID})
		}

		response.Documents[i] = doc
	}

	return response, nil
	//return nil, nil
}
func convertToJSONDocRetrieve(xmlData []byte, docType int) (interface{}, error) {

	if docType == 1 {
		// PDF
		//var efaResult DocPDF = xmlResp.Body.EFADocRetrieveResponse.EFADocRetrieveResult.EFADocRetrieve.DocPDF
		var xmlResp EFADocRetrievePDF
		if err := xml.Unmarshal(xmlData, &xmlResp); err != nil {
			return nil, fmt.Errorf("error unmarshaling SOAP response: %v", err)
		}
		var efaResult DocPDF = xmlResp.DocPDF
		response := &DocRetrieveResponsePDF{
			DocRetrieveResponse: DocRetrieveResponse{
				FileName: efaResult.FileName,
				DocGuid:  efaResult.DocGUID,
			},
			PDFBinary: efaResult.PDFBinary,
		}
		return response, nil
	} else if docType == 4 {
		// TXT
		var xmlResp EFADocRetrieveTXT
		if err := xml.Unmarshal(xmlData, &xmlResp); err != nil {
			return nil, fmt.Errorf("error unmarshaling SOAP response: %v", err)
		}
		var efaResult DocText = xmlResp.DocText
		response := &DocRetrieveResponseTXT{
			DocRetrieveResponse: DocRetrieveResponse{
				FileName: efaResult.FileName,
				DocGuid:  efaResult.DocGUID,
			},
			FreeText: efaResult.FreeText,
		}
		return response, nil
	} else if docType == 5 {
		// XML
		var xmlResp EFADocRetrieveRIXML
		if err := xml.Unmarshal(xmlData, &xmlResp); err != nil {
			return nil, fmt.Errorf("error unmarshaling SOAP response: %v", err)
		}
		var efaResult DocRIXML = xmlResp.DocRIXML
		response := &DocRetrieveResponseRIXML{
			DocRetrieveResponse: DocRetrieveResponse{
				FileName: efaResult.FileName,
				DocGuid:  efaResult.DocGUID,
			},
			RIXMLData: efaResult.RIXMLData,
		}
		return response, nil
	}
	return nil, nil

}

// API handler

func DocSearchHandler(config Config, keyStore APIKeyStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get user and token from context (set by middleware)
		userID := r.Context().Value("user_id").(int)
		token := r.Context().Value("token").(*Token)

		// Log the API request for auditing
		fmt.Printf("DocSearch request from user %d using token %s\n", userID, token.Token)

		// Check HTTP method
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Parse request body
		var req DocSearchRequest
		bodyReq, err1 := io.ReadAll(r.Body)

		defer r.Body.Close()
		if err1 != nil {
			http.Error(w, "Invalid request body: null", http.StatusBadRequest)
			return
		}

		if err2 := json.Unmarshal(bodyReq, &req); err2 != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		fmt.Printf("DocSearch Body Account %s\n", req.AccountName)
		// Add the user's token to request tracking (you might want to log this)

		// Create SOAP request
		soapReq := soapEnvelope{
			Soap: "http://schemas.xmlsoap.org/soap/envelope/",
			Xsi:  "http://www.w3.org/2001/XMLSchema-instance",
			Xsd:  "http://www.w3.org/2001/XMLSchema",
			Body: soapBody{
				EFADocSearch: efaDocSearch{
					Xmlns:          "http://www.edefa.biz/",
					AccountName:    req.AccountName,
					SearchText:     req.SearchText,
					SearchType:     req.SearchType,
					SearchTop:      req.SearchTop,
					LanguageID:     req.LanguageID,
					DocGUID:        req.DocGUID,
					ReportTypeID:   req.ReportTypeID,
					ReportTypeName: req.ReportTypeName,
					MarketIDs:      req.MarketIDs,
					SectorIDs:      req.SectorIDs,
					IndustryIDs:    req.IndustryIDs,
					AuthorIDs:      req.AuthorIDs,
					CorpIDs:        req.CorpIDs,
					DateFrom:       req.DateFrom,
					DateTo:         req.DateTo,
					OrderNewToOld:  req.OrderNewToOld,
					AuthToken:      config.AuthToken,
				},
			},
		}

		// Convert to XML
		xmlData, err := xml.MarshalIndent(soapReq, "", "  ")
		if err != nil {
			http.Error(w, "Error creating request", http.StatusInternalServerError)
			return
		}

		// Create HTTP client with timeout
		client := &http.Client{
			Timeout: 30 * time.Second,
		}

		// Create request to EFA API
		efaReq, err := http.NewRequest("POST", config.EFAEndpoint, bytes.NewBuffer(xmlData))
		if err != nil {
			http.Error(w, "Error creating request", http.StatusInternalServerError)
			return
		}

		efaReq.Header.Set("Content-Type", "text/xml; charset=utf-8")
		efaReq.Header.Set("SOAPAction", "http://www.edefa.biz/EFADocSearch")

		// Make request to EFA API
		resp, err := client.Do(efaReq)
		if err != nil {
			http.Error(w, "Error calling EFA API", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		// Read response
		//dec := xml.NewDecoder(resp.Body)
		body, err := io.ReadAll(resp.Body)

		if err != nil {
			http.Error(w, "Error reading response", http.StatusInternalServerError)
			return
		}
		//str1 := string(body[:])
		//fmt.Printf("DocSearch - EFA Response Body: %sHET", str1)
		// Convert XML to JSON
		jsonResponse, err := convertToJSON(body)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error converting response: %v", err), http.StatusInternalServerError)
			return
		}

		// Send JSON response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(jsonResponse)

		// Log successful request completion
		fmt.Printf("Completed DocSearch request for user %d with %d results\n",
			userID, jsonResponse.Header.RecordCount)
	}
}
func DocRetrieveHandler(config Config, keyStore APIKeyStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get user and token from context (set by middleware)
		userID := r.Context().Value("user_id").(int)
		token := r.Context().Value("token").(*Token)

		// Log the API request for auditing
		fmt.Printf("DocRetrieve request from user %d using token %s\n", userID, token.Token)

		// Check HTTP method
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Parse request body
		var req DocRetrieveRequest
		bodyReq, err1 := io.ReadAll(r.Body)

		defer r.Body.Close()
		if err1 != nil {
			http.Error(w, "Invalid request body: null", http.StatusBadRequest)
			return
		}

		fmt.Printf("DocRetrieve Body %s\n", bodyReq)

		//if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		if err2 := json.Unmarshal(bodyReq, &req); err2 != nil {
			//fmt.Printf("DocSearch |  %s\n", err.Error())
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		fmt.Printf("DocRetrieve Body Account %s\n", req.AccountName)
		// Add the user's token to request tracking (you might want to log this)

		//req.AccountName = fmt.Sprintf("%s-user-%d", req.AccountName, userID)

		// Create SOAP request
		soapReq := soapEnvelopeDocRetrieve{
			Soap: "http://schemas.xmlsoap.org/soap/envelope/",
			Xsi:  "http://www.w3.org/2001/XMLSchema-instance",
			Xsd:  "http://www.w3.org/2001/XMLSchema",
			Body: soapBodyDocRetrieve{
				EFADocRetrieve: efaDocRetrieve{
					Xmlns:       "http://www.edefa.biz/",
					AccountName: req.AccountName,
					DocGUID:     req.DocGUID,
					DocType:     req.DocType,
					AuthToken:   config.AuthToken,
				},
			},
		}

		// Convert to XML
		xmlData, err := xml.MarshalIndent(soapReq, "", "  ")
		if err != nil {
			http.Error(w, "Error creating request", http.StatusInternalServerError)
			return
		}

		// Create HTTP client with timeout
		client := &http.Client{
			Timeout: 30 * time.Second,
		}

		// Create request to EFA API
		efaReq, err := http.NewRequest("POST", config.EFAEndpoint, bytes.NewBuffer(xmlData))
		if err != nil {
			http.Error(w, "Error creating request", http.StatusInternalServerError)
			return
		}

		efaReq.Header.Set("Content-Type", "text/xml; charset=utf-8")
		efaReq.Header.Set("SOAPAction", "http://www.edefa.biz/EFADocRetrieve")

		// Make request to EFA API
		resp, err := client.Do(efaReq)
		if err != nil {
			http.Error(w, "Error calling EFA API", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		// Read response
		//dec := xml.NewDecoder(resp.Body)
		body, err := io.ReadAll(resp.Body)

		if err != nil {
			http.Error(w, "Error reading response", http.StatusInternalServerError)
			return
		}
		//str1 := string(body[:])
		//fmt.Printf("DocRetrieve - EFA Response Body: %s", str1)
		// Convert XML to JSON
		iDocType, err := strconv.Atoi(req.DocType)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error converting DocTyoe: %v", err), http.StatusInternalServerError)
			return
		}
		jsonResponse, err := convertToJSONDocRetrieve(body, iDocType)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error converting response: %v", err), http.StatusInternalServerError)
			return
		}

		// Send JSON response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(jsonResponse)

		// Log successful request completion
		fmt.Printf("Completed DocRetrieve request for user %d with %d results\n",
			userID, jsonResponse)
	}
}
func main() {
	// Initialize configuration
	config := Config{
		EFAEndpoint: os.Getenv("EFA_ENDPOINT"),
		AuthToken:   os.Getenv("EFA_AUTH_TOKEN"),
	}

	// Initialize API key store
	keyStore := NewInMemoryAPIKeyStore()
	// Add some test API keys
	keyStore.AddKey("test-key-1")
	keyStore.AddKey("test-key-2")

	// Create router
	http.HandleFunc("/api/v1/docsearch", DocSearchHandler(config, keyStore))

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server starting on port %s\n", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		fmt.Printf("Error starting server: %v\n", err)
		os.Exit(1)
	}
}
