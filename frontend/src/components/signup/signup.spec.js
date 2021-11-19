import SignupForm from "./SignupForm";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { findByTestAtrr, testStore, checkProps } from "../utils/createStore";
import checkPropTypes from "check-prop-types";

configure({ adapter: new Adapter() });

const setUp = (initialState = {}, props = {}) => {
  const store = testStore(initialState);
  const wrapper = shallow(<SignupForm store={store} {...props} />)
    .childAt(0)
    .dive();
  return wrapper;
};

describe("Signup form", () => {
    let wrapper;
    beforeEach(() => {
        let initialState = {}
        wrapper = setUp(initialState)
    })

    test("It should render the whole component without errors", () => {
        let component = findByTestAtrr(wrapper, "signupComponent")
        expect(component.length).toBe(1)
    })

    test("It should render the form without errors", () => {
        let component = findByTestAtrr(wrapper, "signupForm")
        expect(component.length).toBe(1)
    })
})

