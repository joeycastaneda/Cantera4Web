import os, sys, subprocess
from subprocess import Popen, PIPE, STDOUT
import signal
import matplotlib
import matplotlib.pyplot as plt
from easyprocess import EasyProcess

def run_code(code):
    ban = ["subprocess", "os.", ".remove"]
    if any(x in code for x in ban): #so web user can't break stuff
        return "Error"

    new_code = ""
    with open('exec/exec_template.py', 'r') as template_file:
        new_code = template_file.read()
    template_file.close()
    new_code += code
    with open('new_code.py', 'w') as exec_file:
        exec_file.write(new_code)
    exec_file.close()
    #try:
    #    p = Popen(["python", "new_code.py"], stdout=PIPE, stderr=STDOUT)
    #    output, error = p.communicate()
    #except subprocess.CalledProcessError as e:
    #    except_out = e.output

    s = EasyProcess(["python", "new_code.py"]).call(timeout = 15)
    #print(s)
    #p = EasyProcess(["python", "new_code.py"]).call(timeout = 1)
    #print(p)
    print s.return_code
    os.remove('new_code.py')
    if s.stdout != "" and s.return_code == 0:
        output = s.stdout
    elif s.stderr != "" and s.return_code == 1:
        output = s.stderr
    else:
        if s.return_code != 0:
            output = "Timeout(Infinite loop or program takes too much server time)"
        else:
            output = ""
    #output = (output[:10000] + '..') if len(output) > 10000 else output
    return output

def run_CPP(code):
    new_code = ""
    with open('exec/exec_template.cpp', 'r') as template_file:
        new_code = template_file.readlines()
    template_file.close()
    new_code.insert(7,code)
    with open('exec/new_code.cpp', 'w') as exec_file:
        exec_file.writelines(new_code)
    exec_file.close()
    try:
        make = Popen(["make", "-C", "exec"], stdout=PIPE, stderr=PIPE)
        makeOutput,makeError = make.communicate()
        badStr = """/usr/lib/libcantera.a(ct2ctml.os): In function `Cantera::call_ctml_writer(std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> > const&, bool)':
(.text+0x255c): warning: the use of `tmpnam' is dangerous, better use `mkstemp'\n"""
        fixedMakeError = makeError.replace(badStr, "")
        if(fixedMakeError == ""):
            p = Popen(["exec/new_code"], stdout=PIPE, stderr=STDOUT)
            output, error = p.communicate()
            make = Popen(["make", "-C", "exec", "clean"], stdout=PIPE, stderr=STDOUT)
            os.remove('exec/new_code.cpp')
            return output
        else:
            #print makeError
            output, error = makeOutput, makeError
            os.remove('exec/new_code.cpp')
            return fixedMakeError
    except subprocess.CalledProcessError as e:
        except_out = e.output
        return except_out

def read_file(path):
    with open(path, 'r') as example_file:
        example_code = example_file.read()
    return example_code

def clean_tmp():
    files = [f for f in os.listdir("./tmp") if f != ".gitignore"]
    for f in files:
        os.remove(os.path.join("./tmp", f))