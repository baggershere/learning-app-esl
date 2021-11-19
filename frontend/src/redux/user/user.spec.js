import { SET_USER_STATE } from "./user.types";
import reducer from "./user.reducer";

describe("User reducer", () => {
  it("Should return default state when recieving no type", () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual({
      email: "",
      error: "",
      isAuth: false,
      loading: true,
      loadingLogin: false,
      name: "",
      selectedChild: "",
    });
  });

  it("Should return a new state when recieving a type", () => {
    const payload = { name: "Test", email: "test@test.test" };
    const newState = reducer(undefined, {
      type: SET_USER_STATE,
      payload: payload,
    });
    expect(newState.name).toEqual("Test");
    expect(newState.email).toEqual("test@test.test");
  });
});
