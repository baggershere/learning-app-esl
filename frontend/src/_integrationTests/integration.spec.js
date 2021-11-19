import axios from 'axios'
import {testStore} from '../components/utils/createStore'
import {sessionStatus} from '../redux/user/user.actions'

describe("Login action", () => {
    test("Store is updated to contain user email and name", () => {
        const expectedState = {
            loadingLogin: false,
            name: "Test",
            email: "test@test.test",
            error: "",
            loading: false,
            isAuth: true,
            selectedChild: "",
          }
          const store = testStore();
          
    })
})