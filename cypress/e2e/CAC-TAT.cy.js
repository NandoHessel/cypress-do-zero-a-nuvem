describe('Central de Atendimento ao Cliente TAT', () => {

  beforeEach(() => {
    cy.visit('./src/index.html')
  })


  it('Verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('validar labels', () => {
    cy.get('label[for="firstName"] strong').should('have.text', 'Nome')
    cy.get('label[for="lastName"] strong').should('have.text', 'Sobrenome')
    cy.get('label[for="email"] strong').should('have.text', 'E-mail')
    cy.get('label[for="open-text-area"] strong').should('have.text', 'Como podemos te ajudar? Algum elogio ou feedback para nós?')
  })

  it('Preenche os campos obrigatórios e envia o formulário', () => {
    const longText = 'Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste'

    cy.get('#firstName').type('Fernando')
    cy.get('#lastName').type('Hessel')
    cy.get('#email').type('fernando@email.com')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.contains('.button', 'Enviar').click()

    cy.get('.success').should('be.visible')
  })

  it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Fernando')
    cy.get('#lastName').type('Hessel')
    cy.get('#email').type('fernandoemail.com')
    cy.get('#open-text-area').type('Teste')
    cy.contains('.button', 'Enviar').click()

    cy.get('.error').should('be.visible')
  })

  it('Campo telefone continua vazio quando preenchido com valor não numérico', () => {
    cy.get('#phone')
      .type('abcdefghij')
      .should('have.value', '')
  })

  it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Fernando')
    cy.get('#lastName').type('Hessel')
    cy.get('#email').type('fernandoemail.com')
    cy.get('#open-text-area').type('Teste')
    cy.get('#phone-checkbox').check()

    cy.contains('.button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').type('Fernando').should('have.value', 'Fernando')
    cy.get('#lastName').type('Hessel').should('have.value', 'Hessel')
    cy.get('#email').type('fernandoemail@email.com').should('have.value', 'fernandoemail@email.com')
    cy.get('#open-text-area').type('Teste')
    cy.get('#phone-checkbox').check()
    cy.get('#phone').type('11912345678').should('have.value', '11912345678')

    cy.get('#firstName').clear().should('have.value', '')
    cy.get('#lastName').clear().should('have.value', '')
    cy.get('#email').clear().should('have.value', '')
    cy.get('#phone').clear().should('have.value', '')
  })

  it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.contains('.button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })

  it('Envia o formuário com sucesso usando um comando customizado', () => {
    const data = {
      firstName: 'Gessica',
      lastName: 'Santos',
      email: 'gessica@email.com',
      comments: 'Teste'
    }

    cy.fillMandatoryFieldsAndSubmit(data)

    cy.get('.success').should('be.visible')
  })

  it('Envia o formuário com sucesso usando um comando customizado com objeto default', () => {
    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.success').should('be.visible')
  })

  it('Seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('Seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('Seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback', () => {
    cy.get('input[value="feedback"]')
      .check()
      .should('be.checked')
  })

  it('Marcar cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .each(typeOfservices => {
        cy.wrap(typeOfservices)
          .check()
          .should('be.checked')
      })
  })

  it('Marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')

    cy.get('input[type="checkbox"]').last()
      .uncheck()
      .should('not.be.checked')
  })

  it('Seleciona um arquivo na pasta fixtures', () => {
    cy.get('#file-upload').selectFile('cypress/fixtures/example.json')
      .should(input => {
        (expect(input[0].files[0].name)).to.equal('example.json')
      })
  })

  it('Seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload').selectFile('cypress/fixtures/example.json', { action: "drag-drop" })
      .should(input => {
        (expect(input[0].files[0].name)).to.equal('example.json')
      })
  })

  it('Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')

    cy.get('#file-upload').selectFile('@sampleFile')
      .should(input => {
        (expect(input[0].files[0].name)).to.equal('example.json')
      })
  })

  it('Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.get('a[href="privacy.html"]').should('have.attr', 'target', '_blank')
  })

  it('Acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('a[href="privacy.html"]')
      .invoke('removeAttr', 'target')
      .should('not.have.attr', 'target', '_blank')
      .click()

    cy.get('#title')
      .should('be.visible')
      .should('have.text', 'CAC TAT - Política de Privacidade')
  })

  it('Testa a página da política de privacidade de forma independente', () => {
    cy.visit('./src/privacy.html')

    cy.get('#title')
      .should('be.visible')
      .should('have.text', 'CAC TAT - Política de Privacidade')
  })

})


