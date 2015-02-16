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

    it('store string into test namepsace', inject(function(crSession) {
        crSession.set("test", "string")
        expect(crSession.get("test")).toBe("string");
    }));

});
