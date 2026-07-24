@api
Feature: Catch Recording API
  As an automated test suite
  I want to call the Catch Recording API directly
  So that I can validate backend behaviour independently of the UI

  Scenario: Login endpoint accepts valid credentials
    When I call the login endpoint with username "randhirpatel6715@gmail.com" and password "Thinkpad@2026"
    Then the response status should be 200
