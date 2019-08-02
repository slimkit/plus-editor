/// <reference types="cypress" />

describe('Rech-text editor', () => {
  before(() => {
    cy.visit('/')
  })
  beforeEach(() => {
    cy.viewport(360, 640)
  })

  it('should be render correctly', () => {
    cy.get('.ql-editor').type('Hello')
    cy.get('.ql-header[value="1"]').click()
    cy.get('.ql-editor').type('{enter}world!')

    cy.get('.ql-editor h1').should('contain', 'Hello')
    cy.get('.ql-editor p').should('contain', 'world')
  })

  it('can insert image', () => {
    cy.readFile('cypress/fixtures/preview_image.jpeg', 'base64').then(image => {
      const base64 = `data:image/jpeg;base64,${image}`
      cy.window().then(win => {
        win.debug = true
        win.imagePreviewReceiver(JSON.stringify([{ id: 1, base64 }]))

        cy.get(`#quill-image-1`).should('have.attr', 'src', base64)
      })
    })
  })

  it('can replace base64 image to url', () => {
    cy.window().then(win => {
      const imageURL = 'https://avatars0.githubusercontent.com/u/9391981?s=460&v=4'
      win.imageUrlReceiver(JSON.stringify([{ id: 1, url: imageURL }]))

      win.launcher = {
        sendContentHTML() {},
      }

      cy.spy(win.launcher, 'sendContentHTML').args
      win.editorSubmitReceiver()

      const expectArgs = JSON.stringify({
        html: `<h1>Hello</h1><p>world!</p><img id="quill-image-1" class="quill-image" src="${imageURL}"><p><br></p>`,
        pendingImages: [],
      })
      expect(win.launcher.sendContentHTML).to.be.calledWithMatch(expectArgs)
    })
  })

  it('should be break line on insert image', () => {
    cy.visit('/')
    cy.get('.ql-editor').type('Hello')
    cy.get('.ql-header[value="1"]').click()
    cy.get('.ql-editor').type('{enter}world!')

    cy.get('.ql-editor p').type('{leftarrow}{leftarrow}')
    cy.readFile('cypress/fixtures/preview_image.jpeg', 'base64').then(image => {
      const base64 = `data:image/jpeg;base64,${image}`
      cy.window().then(win => {
        win.imagePreviewReceiver(JSON.stringify([{ id: 1, base64 }]))

        cy.get(`#quill-image-1`).should('have.attr', 'src', base64)
        cy.get('.ql-editor p').should('have.length', 2)
      })
    })
  })
})
