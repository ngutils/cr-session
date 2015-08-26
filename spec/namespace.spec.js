describe("cr-session module", function(){

    beforeEach(function(){
        module('cr.session');
    });

    it('set and get on different namespace', inject(function(crSession) {
        crSession.set("key", "string", "car")
        expect(crSession.get("key", "car")).toBe("string");
        expect(crSession.get("key")).toBe(undefined);
    }));

    it('delete from namespace', inject(function(crSession) {
        crSession.set("key", "string", "car")
        crSession.delete("key", "car");
        expect(crSession.get("key", 'car')).toBe(undefined);
    }));

    it('purge namespace', inject(function(crSession) {
        crSession.set("key", "string", "car")
        crSession.purgeNamespace("car");
        expect(crSession.get("key",'car')).toBe(null);
    }));
});

