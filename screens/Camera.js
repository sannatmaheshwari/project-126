import * as React from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class PickImage extends React.Component{
    state = {image:null}
    componentDidMount(){
        this.getpermissions()
    }
    getpermissions = async()=>{
        if(Platform.OS!=="web"){
            const {status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status!=="granted"){
                alert("Sorry , we need camera roll permissions to make this work")
            }
        }
    }
    pickimage = async()=>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.All,
                allowsEditing:true,
                aspect:[4,3],
                quality:1
            })
            if(!result.cancelled){
                this.setState({image:result.data})
                this.uploadImage(result.uri)
            }
        }
        catch{

        }
    }
    uploadImage = async(uri)=>{
        const data = new FormData()
        let filename = uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const filetoupload = {
            uri:uri,
            name:filename,
            type:type
        }
        data.append("digit",filetoupload)
        fetch("https://3203-49-36-179-252.in.ngrok.io/predictdigit",{
            method:"POST",
            body:data,
            headers:{"content-type": "multipart/form-data",}
        })
        .then((response) => response.json())
        .then((result) => {
            console.log("Success:", result);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }
    render(){
        let {image}=this.state
        return(
            <View style = {{flex: 1, alignItems: "center", justifyContent: "center"}}>
                <Button
                title = "pick an image"
                onPress = {this.PickImage} 
                ></Button>

            </View>
        )
    }
}