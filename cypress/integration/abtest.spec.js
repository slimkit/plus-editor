/// <reference types="cypress" />

describe('Rech-text editor', () => {
  beforeEach(() => {
    cy.viewport(360, 640)
  })

  context('Framework', () => {
    it('should be run in Android webview', () => {
      cy.visit('/')
      cy.window().then(win => {
        win.launcher = {
          chooseImage() {},
        }
        cy.spy(win.launcher, 'chooseImage')

        cy.get('.ql-toolbar .ql-image')
          .click()
          .then(() => {
            expect(win.launcher.chooseImage).to.be.calledWith()
          })
      })
    })

    it('should be run in iOS webview', () => {
      cy.visit('/')
      cy.window().then(win => {
        win.messageHandlers = {
          chooseImage() {},
        }

        cy.spy(win.messageHandlers, 'chooseImage')
        cy.get('.ql-toolbar .ql-image')
          .click()
          .then(() => {
            expect(win.messageHandlers.chooseImage).to.be.calledWith()
          })
      })
    })

    it('should be render correctly', () => {
      cy.visit('/')
      cy.get('.ql-editor').type('Hello')
      cy.get('.ql-header[value="1"]').click()
      cy.get('.ql-editor').type('{enter}world!')

      cy.get('.ql-editor h1').should('contain', 'Hello')
      cy.get('.ql-editor p').should('contain', 'world')
    })

    it('can be initial content', () => {
      cy.visit('/')
      cy.window().then(win => {
        win.quill.root.innerHTML = '<h1>Hello</h1><p>world!</p>'

        cy.get('.ql-editor h1').should('contain', 'Hello')
        cy.get('.ql-editor p').should('contain', 'world')
      })
    })

    // 这个测试用例在 headless 下无法通过
    it.skip('should be scroll to cursor position when window size change', () => {
      cy.visit('/')
      cy.get('.ql-editor')
        .type('start{enter}')
        .type(
          new Array(80)
            .fill()
            .map((_, i) => `${i}{enter}`)
            .join(''),
        )
        .type('end')
        .then($el => {
          $el.scrollTop = 0
        })
      cy.window().then(win => {
        const el = win.document.querySelector('.ql-editor')
        el.scrollTop = 0
        cy.wait(500).then(() => {
          cy.viewport(360, 360)
          cy.wait(10).then(() => {
            expect(el.scrollTop).to.equal(el.scrollHeight - el.clientHeight)
          })
        })
      })
    })
  })

  context('Image interface', () => {
    before(() => {
      cy.viewport(360, 640)
      cy.visit('/')
      cy.get('.ql-editor').type('Hello')
      cy.get('.ql-header[value="1"]').click()
      cy.get('.ql-editor').type('{enter}world!')
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

    it('cursor should be after image', () => {
      cy.window().then(win => {
        const { index } = win.quill.getSelection()
        expect(index).to.equal(14)
      })
    })

    it('can replace base64 image to url', () => {
      cy.window().then(win => {
        const imageURL = 'https://avatars0.githubusercontent.com/u/9391981?s=460&v=4'
        win.imageUrlReceiver(JSON.stringify([{ id: 1, url: imageURL }]))

        win.launcher = {
          sendContentHTML() {},
        }

        cy.spy(win.launcher, 'sendContentHTML')
        win.editorSubmitReceiver()

        const expectArgs = JSON.stringify({
          html: `<h1>Hello</h1><p>world!</p><img id="quill-image-1" class="quill-image" src="${imageURL}"><p><br></p>`,
          pendingImages: [],
        })
        expect(win.launcher.sendContentHTML).to.be.calledWith(expectArgs)
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

    it('should can be upload failed', () => {
      cy.visit('/')
      cy.window().then(win => {
        win.debug = true

        cy.readFile('cypress/fixtures/preview_image.jpeg', 'base64').then(image => {
          const base64 = `data:image/jpeg;base64,${image}`
          win.imagePreviewReceiver(JSON.stringify([{ id: 1, base64 }]))
          cy.get(`#quill-image-1`)
            .as('image')
            .should('have.attr', 'src', base64)

          cy.wait(200).then(() => {
            win.launcher = {
              reuploadImage() {},
            }
            cy.spy(win.launcher, 'reuploadImage')

            win.imageFailedReceiver('1')

            cy.wait(200).then(() => {
              cy.get('@image')
                .should('not.have.attr', 'src', base64)
                .click()
                .should('have.attr', 'src', base64)
            })
          })
        })
      })
    })
  })
})
