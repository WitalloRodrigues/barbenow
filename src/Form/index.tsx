import { 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View,
    Vibration,
    Pressable,
    Keyboard,
    FlatList,
    Dimensions
} from "react-native";
import Result from "../result";
import { useState } from "react";
import tw from "@/tailwind";
import { moneyMask } from "@/mask/money.mask";
import { onlyNumbers } from "@/mask/only-numbers";
import { heightMask } from "@/mask/height.mask";


export default function Form() {

    const [altura, setAltura] = useState<string | null>("");
    const [peso, setPeso] = useState<string | null>("");
    const [resultado, setResultado] = useState<string | null>(null);
    const [messagemResultado, setMessagemResultado] = useState("Preencha os campos acima");
    const [textButton, setTextButton] = useState("Calcular");
    const [loading, setLoading] = useState(false);
    const [errorAltura, setErrorAltura] = useState("");
    const [errorPeso, setErrorPeso] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [imcList, setImcList] = useState<any[]>([]);
    

    function voltar() {
        setResultado(null);
        setMessagemResultado("Preencha os campos acima");
        setTextButton("Calcular");
        setAltura("");
        setPeso("");
    }

    function calcular() {
        

        
        
        setMessagemResultado("Mensagem");
        

        if(altura === null || altura.trim() === "") {
            setErrorAltura("Campo obrigatório");
        } else {
            setErrorAltura("");
        }
        if(peso === null || peso.trim() === "") {
            setErrorPeso("Campo obrigatório");
        } else {
            setErrorPeso("");
        }
        

        if (altura === null || altura.trim() === "" || peso === null || peso.trim() === "") {
            
            Vibration.vibrate(2100);
            setMessagemResultado("Preencha os campos acima");
            setTextButton("Calcular");
            setResultado(null);
            return;
        }
        

        const alturaNumber = parseFloat(altura.replace(",", "."));
        const pesoNumber = parseFloat(peso);
        
        if (isNaN(alturaNumber) || isNaN(pesoNumber)) {
            Vibration.vibrate(2100);
            setMessagemResultado("Por favor, insira valores numéricos válidos");
            setTextButton("Calcular");
            setResultado(null);
            return;
        }

        // setLoading(true);
        // setTextButton("Calculando...");
        
        // setTimeout(() => {
        //     setLoading(false);
        //     setTextButton("Calcular");
        // }, 4000);
        
        const imc = pesoNumber / (alturaNumber * alturaNumber);

        console.log(altura);
        console.log(peso);
        console.log(imc);
        
        setMessagemResultado("Seu IMC é: ");
        setResultado(imc.toFixed(2));

        setImcList((prevList) => {
            const newList = [...prevList, { index: imcList.length, altura: `${altura} m`, peso: `${peso} Kg`, imc: imc.toFixed(2) }];
            return newList;
        });

        setTextButton("Calcular novamente");
        setAltura(null);
        setPeso(null);

    }

    const screenHeight = Dimensions.get('window').height * 0.8;

    return (
        
        <Pressable onPress={Keyboard.dismiss} style={tw`flex  items-center w-full h-[${screenHeight}px] b-0 bg-white  rounded rounded-3xl`}>
            {
                !(resultado) ? (
                    <View style={tw`w-full mt-4 px-6 py-2`}>
                {/* <Text style={tw`text-2xl font-bold text-center text-gray-800`}>Calculadora de IMC</Text> */}
                {
                    (errorPeso !== "" || errorAltura !== "") && (
                        <View style={tw`flex-row items-center mb-2`}>
                    <Text style={tw`text-red-500 text-lg mr-2`}>⚠️</Text>
                    <Text style={tw`text-gray-600 text-sm`}>Coloque seus dados abaixo</Text>
                </View>
                    )
                }
                <Text style={tw`py-2 text-base`}>Altura<Text style={tw`ml-1 text-red-500`}>*</Text></Text>
                <TextInput
                    onChange={(e) => {
                        // Remove special characters and allow only numbers and comma
                        const rawValue = e.nativeEvent.text.trim()
                            .replace(/[^0-9,]/g, '')
                            .replace(".", ",");

                        // Se o usuário apagar tudo, mantém o campo vazio
                        if (rawValue === "" || rawValue === null) {
                            setAltura("");
                            return;
                        }
                        setErrorAltura("");
                        const formattedValue = heightMask(onlyNumbers(rawValue));
                        setAltura(formattedValue);
                    }}
                    
                    placeholder="Ex.: 1,75"
                    keyboardType="numeric"
                    placeholderTextColor="gray"
                    value={altura ?? ""}
                    style={tw`text-black text-base pl-3 rounded rounded-3xl border border-gray-300 h-10 bg-[#f3f9f1]`}
                    
                />
                <Text style={tw`text-red-500 text-xs`}>{errorAltura}</Text>
                <Text style={tw`py-2 text-base`}>Peso<Text style={tw`ml-1 text-red-500`}>*</Text></Text>
                <TextInput
                    onChange={(e) => {
                        const rawValue = e.nativeEvent.text.trim()
                            .replace(/[^0-9,]/g, '')
                            .replace(".", ",");
                            setPeso(rawValue);
                        ; setErrorPeso("")}}
                    placeholder="Ex.: 64Kg"
                    placeholderTextColor="gray"
                    keyboardType="numeric"
                    value={peso ?? ""}
                    style={tw`text-black text-base pl-3 rounded rounded-3xl border border-gray-300 h-10 bg-[#f3f9f1]`}
                />
                <Text style={tw`text-red-500 text-xs`}>{errorPeso}</Text>
                <TouchableOpacity
                    onPress={() => calcular()}
                    style={tw`flex justify-center items-center bg-red-500 rounded rounded-3xl h-10 mt-16` }
                >
                    <Text style={tw`text-white font-bold`}>{textButton}</Text>
                </TouchableOpacity>
            </View>):(
                <View style={tw`w-full h-full mt-4 px-6 py-2 flex-1`}>
                <TouchableOpacity
                    onPress={() => voltar()}
                    style={tw`flex justify-center items-center bg-red-500 rounded rounded-3xl h-10 mt-4` }
                >
                    <Text style={tw`text-white font-bold`}>{textButton}</Text>
                </TouchableOpacity>
                <Result result={resultado} messagemResultado={messagemResultado}/>
                <FlatList
                    data={imcList.sort((a, b) => b.index - a.index)}
                    keyExtractor={(item) => item.index.toString()}
                    renderItem={({ item }) => (
                        <View style={tw`flex-row justify-between items-center bg-white p-4 border-b border-gray-300`}>
                            <Text style={tw`text-gray-800`}>Altura: {item.altura}</Text>
                            <Text style={tw`text-gray-800`}>Peso: {item.peso}</Text>
                            <Text style={tw`text-gray-800`}>IMC: {item.imc}</Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={true}
                    style={tw`flex-1 w-full mt-4`}
                    contentContainerStyle={tw`rounded-3xl bg-white`}
                    stickyHeaderIndices={[0]}
                    ListHeaderComponent={
                        <View style={tw`bg-white py-2`}>
                            <Text style={tw`text-gray-800 text-lg font-bold text-center`}>Histórico de IMC</Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <Text style={tw`text-gray-500 text-center`}>Nenhum IMC calculado ainda.</Text>
                    }
                    ListFooterComponent={
                        <View style={tw`h-20`} />
                    }
                />
            </View>
            )
            }
            
            
        </Pressable>
    );
}