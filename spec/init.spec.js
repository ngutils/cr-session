describe("cr-session module", function(){

    beforeEach(function(){
        module('cr.session');
    });

    it('localStorageService is injected into the module', inject(function(localStorageService) {
        expect(localStorageService).toBeDefined();
    }));

    it('load crSession provider', inject(function(crSession) {
        expect(crSession).toBeDefined();
    }));

});
