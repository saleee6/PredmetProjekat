import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Admin } from '../models/admin.model';
import { Subject } from 'rxjs';
import { VehicleReservation } from '../models/vehicle-reservation.model';
import { FlightReservation } from '../models/flight-reservation.model';
import { Vehicle } from '../models/vehicle.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TOFriend } from '../t-o-models/t-o-friend.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(
        private http: HttpClient
    ) {}

    friends: TOFriend[] = [];
    requests: TOFriend[] = [];
    sent: TOFriend[] = [];
    people: User[] = [];

    loggedInUserChanged = new Subject<User>();
    requestUser = new Subject<TOFriend[]>();
    friendsUser = new Subject<TOFriend[]>();
    sentUser = new Subject<TOFriend[]>();
    searchUser = new Subject<User[]>();
    requestCount = new Subject<number>();

    private user: User = new User(
        'regular',
        'testUsername',
        'test@gmail.com',
        'pass',
        'Name',
        'Surname',
        'City',
        '123456789'
    );

    private loggedInUser: any;

    private users: User[] = [
        this.user,
    ];

    getLoggedInUser() {
        return this.loggedInUser;
    }

    checkPassword(password: string) {
        return password === this.loggedInUser.password;
    }

    updateUser(username: string, newEmail: string, newName: string, newSurname: string, newCity: string, newPhone: string) {
        let index = this.users.indexOf(this.loggedInUser);
        this.users[index].email = newEmail;
        // this.users[index].password = newPassword;
        this.users[index].name = newName;
        this.users[index].surname = newSurname;
        this.users[index].city = newCity;
        this.users[index].phoneNumber = newPhone;
        this.loggedInUser = this.users[index];
        this.loggedInUserChanged.next(this.users[index]);
    }

    // updatePassword(newPassword: string) {
    //     let index = this.users.indexOf(this.loggedInUser);
    //     this.users[index].password = newPassword;
    //     this.loggedInUserChanged.next(this.users[index]);
    // }

    editUser(updatedUser: User) {
        let address = 'http://localhost:' + localStorage.getItem('userPort') + '/api/AppUsers/UpdateUser';
        return this.http
        .put(
            address,
            updatedUser.ToTO()
        );
    }

    updateCompanyName(companyName: string) {
        let address = 'http://localhost:' + localStorage.getItem('userPort') + '/api/AppUsers/UpdateCompany/' + localStorage.getItem('username');
        return this.http
        .put(
            address,
            {company: companyName}
        );
    }

    register(user: User) {
        var body = {
            UserName: user.userName,
            Email: user.email,
            Password: user.password,
            Name: user.name,
            Surname: user.surname,
            PhoneNumber: user.phoneNumber,
            City: user.city,
            Role: user.role
        }
        let address = "http://localhost:" + localStorage.getItem('userPort') + '/api/AppUsers/Register';
        return this.http.post(address, body);
    }

    login(usermail: string, password: string) {
        var user = {
            Username: usermail,
            Password: password
        }
        let address = "http://localhost:" + localStorage.getItem('userPort') + '/api/AppUsers/Login';
        return this.http.post(address, user);
    }

    getUser() {
        let address = "http://localhost:" + localStorage.getItem('userPort') + '/api/AppUsers/GetUserProfile';
        return this.http.get(address);
    }

    externalLogin(formData){
        let address = "http://localhost:" + localStorage.getItem('userPort') + '/api/AppUsers/SocialLogin';
        return this.http.post(address, formData);
    }

    gotUser(user: User){
        this.friends = [];
        this.sent = [];
        this.requests = [];
        this.people = [];

        for(let friend of user.tOFriendsB){
            if(friend.status == "pending"){
                this.requests.push(friend);
            }
            else{
                this.friends.push(friend);
            }
        }

        this.requestUser.next(this.requests);

        for(let friend of user.tOFriendsA){
            if(friend.status == "pending"){
                this.sent.push(friend);
            }
            else{
                this.friends.push(friend);
            }
        }
        
        this.friendsUser.next(this.friends);
        this.sentUser.next(this.sent);

        this.getAllUsers().subscribe(
            response => {
                this.people = response;

                for(let person of this.people){
                    if(person.userName == user.userName){
                        this.people.splice(this.people.indexOf(person), 1);
                        break;
                    }
                }
                
                for(let friend of this.requests){
                    for(let person of this.people){
                        if(person.userName == friend.friendA.userName){
                            this.people.splice(this.people.indexOf(person), 1);
                            break;
                        }
                    }
                }
                
                for(let friend of this.sent){
                    for(let person of this.people){
                        if(person.userName == friend.friendB.userName){
                            this.people.splice(this.people.indexOf(person), 1);
                            break;
                        }
                    }
                }

                for(let friend of this.friends){
                    for(let person of  this.people){
                        if(person.userName == friend.friendA.userName){
                            this.people.splice(this.people.indexOf(person), 1);
                            break;
                        }
                        else if(person.userName == friend.friendB.userName){
                            this.people.splice(this.people.indexOf(person), 1);
                            break;
                        }
                    }
                }

                this.searchUser.next(this.people);
            }
        );
        
    }

    peopleListChange(user: User, friend: TOFriend){
        let index = this.people.indexOf(user);
        this.people.splice(index,1);
        this.searchUser.next(this.people);
        this.sent.push(friend);
        this.sentUser.next(this.sent);
    }

    requestListChange(id: number){
        let tempFriend: TOFriend;
        let counter = 0;
        for(let friend of this.requests){
            if(friend.id == id){
                tempFriend = friend;
                this.requests.splice(counter,1);
                break;
            }
            counter++;
        }
        this.people.push(tempFriend.friendA);
        this.requestUser.next(this.requests);
        this.searchUser.next(this.people);
    }

    friendListChange(id: number){
        let tempFriend: TOFriend;
        let counter = 0;
        for(let friend of this.friends){
            if(friend.id == id){
                tempFriend = friend;
                this.friends.splice(counter,1);
                break;
            }
            counter++;
        }
        let user = JSON.parse(localStorage.getItem('user'));
        if(user.userName == tempFriend.friendA.userName)
            this.people.push(tempFriend.friendB);
        else
            this.people.push(tempFriend.friendA);
        this.searchUser.next(this.people);
        this.friendsUser.next(this.friends);
    }

    sentListChange(id: number){
        let tempFriend: TOFriend;
        let counter = 0;
        for(let friend of this.sent){
            if(friend.id == id){
                tempFriend = friend;
                this.sent.splice(counter,1);
                break;
            }
            counter++;
        }
        this.people.push(tempFriend.friendB);
        this.requestUser.next(this.sent);
        this.searchUser.next(this.people);
    }

    moveToFriends(id: number){
        let counter = 0;
        let tempFriend;
        for(let friend of this.requests){
            if(friend.id == id){
                tempFriend = friend;
                this.requests.splice(counter,1);
                break;
            }
            counter++;
        }
        tempFriend.status = "accepted";
        this.friends.push(tempFriend);
        this.requestUser.next(this.requests);
        this.friendsUser.next(this.friends);
    }

    MakeRequest(userA: User, userB: User){
        let address = "http://localhost:" + localStorage.getItem('userPort') + '/api/AppUsers/AddFriendship';
        return this.http.post<TOFriend>(address, {userA: userA, userB: userB});
    }

    UpdateStatus(id: number, status: string){
        let address = "http://localhost:" + localStorage.getItem('userPort') + '/api/AppUsers/FriendshipStatus/' + id.toString();
        return this.http.put(address,{status: status});
    }

    DeclineRequest(id: number){
        let address = "http://localhost:" + localStorage.getItem('userPort') + '/api/AppUsers/DeleteFriendship/' + id.toString();
        return this.http.delete(address);
    }

    getAllUsers(){
        let address = "http://localhost:" + localStorage.getItem('userPort') + '/api/AppUsers/AllUsers';
        return this.http.get<User[]>(address);
    }

    verifyEmail(token: string,username : string){
        let address = "http://localhost:" + localStorage.getItem('userPort') + '/api/AppUsers/Confirmation';
        
        var params = new HttpParams()
        .append('username',username)
        .append('token',token);
  
      return this.http.get(address, {params: params});
    }

    updatePassword(oldPassword: string, newPassword: string) {
        let address = "http://localhost:" + localStorage.getItem('userPort') + '/api/AppUsers/UpdatePassword';
        return this.http.put(address, {oldPassword: oldPassword, newPassword: newPassword});
    }
}