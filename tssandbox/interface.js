function birthYear(person) {
    var _a;
    return 2020 - (((_a = person) === null || _a === void 0 ? void 0 : _a.age) || 0);
}
console.log(birthYear({ name: 'Helmut', age: 55 }));
