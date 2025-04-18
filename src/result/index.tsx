import tw from "@/tailwind";
import { Share, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons"

export default function Result(props:{result:string | null, messagemResultado:string | null}) {
    
    const onShare = async () => {
        const result = await Share.share({
            message: `Seu IMC é ${props.result}`,
        })
    }

    return (
        <View style={tw`flex mt-1 p-1 rounded-3xl justify-center items-center w-full`}>
            
            
            <Text style={tw`text-base text-red-500 font-bold mt-2`}>{props.messagemResultado}</Text>
            <Text style={tw`text-3xl text-red-500 font-bold mt-2`}>{props.result}</Text>
            <View>
                {
                    props.result !== null && (
                        <TouchableOpacity onPress={onShare} style={tw`flex flex-row items-center bg-red-500 rounded-full px-3 py-[6]`}>
                            <Feather name="share" size={14} color="white" />
                            <Text style={tw`text-white font-bold text-xs ml-2`}>Compartilhar</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        </View>
    );
}