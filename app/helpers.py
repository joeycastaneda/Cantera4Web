import os, sys, subprocess
from subprocess import Popen, PIPE, STDOUT
import matplotlib
import matplotlib.pyplot as plt

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
    try:
        p = Popen(["python", "new_code.py"], stdout=PIPE, stderr=STDOUT)
        output, error = p.communicate()
    except subprocess.CalledProcessError as e:
        except_out = e.output
    os.remove('new_code.py')
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
        if(makeError == ""):
            p = Popen(["exec/new_code"], stdout=PIPE, stderr=STDOUT)
            output, error = p.communicate()
            make = Popen(["make", "-C", "exec", "clean"], stdout=PIPE, stderr=STDOUT)
            os.remove('exec/new_code.cpp')
            return output
        else:
            output, error = makeOutput, makeError
            os.remove('exec/new_code.cpp')
            return makeError
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